import { useEffect, useRef, useState } from 'react';
import './App.css';
import Description from './components/Description';
import { useQuery, useQueryClient } from 'react-query';

import axios from 'axios';

import * as d3 from 'd3';
import Navbar from './components/Navbar';
import ModalComponent from './components/ModalComponent';
import AddTechnologyModal from './components/AddTechnologyModal';
import WarningDialog from './components/WarningDialog';

function useGetAllEntries() {
  return useQuery(
    'entries',
    async () => {
      const { data } = await axios.get(
        'https://expressjs-prisma-production-53f4.up.railway.app/'
      );
      return data;
    },
    { refetchOnWindowFocus: false }
  );
}

function App() {
  const queryClient = useQueryClient();
  const runVisualizationEmpty = () => {
    radar_visualization({
      svg_id: 'radar',
      width: 1450,
      height: 1000,
      colors: {
        background: '#fff',
        grid: '#dddde0',
        inactive: '#ddd',
      },
      title: 'BMW Group Tech Radar',
      date: '2023.06',
      quadrants: [
        { name: 'Languages' },
        { name: 'Infrastructure' },
        { name: 'Datastores' },
        { name: 'Frameworks and Libraries' },
      ],
      rings: [
        { name: 'ADOPT', color: '#5ba300' },
        { name: 'TRIAL', color: '#009eb0' },
        { name: 'ASSESS', color: '#c7ba00' },
        { name: 'HOLD', color: '#e09b96' },
      ],
      print_layout: true,
      links_in_new_tabs: true,
      // zoomed_quadrant: 0,
      //ENTRIES
      entries: [],
    });
  };

  const [label, setLabel] = useState('');
  const [quadrant, setQuadrant] = useState(null);
  const [ring, setRing] = useState(null);
  const [myBlips, setBlips] = useState([]);
  const [zoomed_quadrant, setZoomedQuadrant] = useState(null);

  const handleBlipModalOpen = (label, quadrant, ring) => {
    setLabel(label);
    setQuadrant(quadrant);
    setRing(ring);
  };

  const onBlipClick = (blipLabel) => {
    console.log('blip id is');
    console.log(blipLabel);
    console.log('myblips');
    console.log(myBlips);

    const tempBlips = myBlips.slice();
    console.log('tempblips');
    console.log(tempBlips);

    const blipIndex = tempBlips.findIndex((blip) => blip.label === blipLabel);

    const blipFound = tempBlips[blipIndex];

    const { label, quadrant, ring } = blipFound;
    handleBlipModalOpen(label, quadrant, ring);
    setIsOpen(true);
  };

  //uniq
  function radar_visualization(config) {
    // custom random number generator, to make random sequence reproducible
    // source: https://stackoverflow.com/questions/521295
    var seed = 42;
    function random() {
      var x = Math.sin(seed++) * 10000;
      return x - Math.floor(x);
    }

    function random_between(min, max) {
      return min + random() * (max - min);
    }

    function normal_between(min, max) {
      return min + (random() + random()) * 0.5 * (max - min);
    }

    // radial_min / radial_max are multiples of PI
    const quadrants = [
      { radial_min: 0, radial_max: 0.5, factor_x: 1, factor_y: 1 },
      { radial_min: 0.5, radial_max: 1, factor_x: -1, factor_y: 1 },
      { radial_min: -1, radial_max: -0.5, factor_x: -1, factor_y: -1 },
      { radial_min: -0.5, radial_max: 0, factor_x: 1, factor_y: -1 },
    ];

    const rings = [
      { radius: 90 },
      { radius: 150 },
      { radius: 240 },
      { radius: 330 },
    ];

    const title_offset = { x: -675, y: -420 };

    const footer_offset = { x: -675, y: 420 };

    const legend_offset = [
      { x: 400, y: 90 },
      { x: -625, y: 90 },
      { x: -625, y: -250 },
      { x: 400, y: -250 },
    ];

    function polar(cartesian) {
      var x = cartesian.x;
      var y = cartesian.y;
      return {
        t: Math.atan2(y, x),
        r: Math.sqrt(x * x + y * y),
      };
    }

    function cartesian(polar) {
      return {
        x: polar.r * Math.cos(polar.t),
        y: polar.r * Math.sin(polar.t),
      };
    }

    function bounded_interval(value, min, max) {
      var low = Math.min(min, max);
      var high = Math.max(min, max);
      return Math.min(Math.max(value, low), high);
    }

    function bounded_ring(polar, r_min, r_max) {
      return {
        t: polar.t,
        r: bounded_interval(polar.r, r_min, r_max),
      };
    }

    function bounded_box(point, min, max) {
      return {
        x: bounded_interval(point.x, min.x, max.x),
        y: bounded_interval(point.y, min.y, max.y),
      };
    }

    function segment(quadrant, ring) {
      var polar_min = {
        t: quadrants[quadrant].radial_min * Math.PI,
        r: ring == 0 ? 30 : rings[ring - 1].radius,
      };
      var polar_max = {
        t: quadrants[quadrant].radial_max * Math.PI,
        r: rings[ring].radius,
      };
      var cartesian_min = {
        x: 15 * quadrants[quadrant].factor_x,
        y: 15 * quadrants[quadrant].factor_y,
      };
      var cartesian_max = {
        x: rings[3].radius * quadrants[quadrant].factor_x,
        y: rings[3].radius * quadrants[quadrant].factor_y,
      };
      return {
        clipx: function (d) {
          var c = bounded_box(d, cartesian_min, cartesian_max);
          var p = bounded_ring(polar(c), polar_min.r + 15, polar_max.r - 15);
          d.x = cartesian(p).x; // adjust data too!
          return d.x;
        },
        clipy: function (d) {
          var c = bounded_box(d, cartesian_min, cartesian_max);
          var p = bounded_ring(polar(c), polar_min.r + 15, polar_max.r - 15);
          d.y = cartesian(p).y; // adjust data too!
          return d.y;
        },
        random: function () {
          return cartesian({
            t: random_between(polar_min.t, polar_max.t),
            r: normal_between(polar_min.r, polar_max.r),
          });
        },
      };
    }

    // position each entry randomly in its segment
    for (var i = 0; i < config.entries.length; i++) {
      var entry = config.entries[i];
      entry.segment = segment(entry.quadrant, entry.ring);
      var point = entry.segment.random();
      entry.x = point.x;
      entry.y = point.y;
      entry.color =
        entry.active || config.print_layout
          ? config.rings[entry.ring].color
          : config.colors.inactive;
    }

    // partition entries according to segments
    var segmented = new Array(4);
    for (var quadrant = 0; quadrant < 4; quadrant++) {
      segmented[quadrant] = new Array(4);
      for (var ring = 0; ring < 4; ring++) {
        segmented[quadrant][ring] = [];
      }
    }
    for (let i = 0; i < config.entries.length; i++) {
      const entry = config.entries[i];
      segmented[entry.quadrant][entry.ring].push(entry);
    }

    // assign unique sequential id to each entry
    var id = 1;
    // eslint-disable-next-line
    for (var quadrant of [2, 3, 1, 0]) {
      // eslint-disable-next-line
      for (var ring = 0; ring < 4; ring++) {
        var entries = segmented[quadrant][ring];
        entries.sort(function (a, b) {
          return a.label.localeCompare(b.label);
        });
        // eslint-disable-next-line
        for (var i = 0; i < entries.length; i++) {
          console.log('entries[i]');
          console.log(entries[i]);
          if (entries[i].id != null || entries[i].id != undefined) {
            console.log('no new id');
            break;
          } else {
            entries[i].id = '' + id++;
          }
        }
      }
    }

    function translate(x, y) {
      return 'translate(' + x + ',' + y + ')';
    }

    function viewbox(quadrant) {
      return [
        Math.max(0, quadrants[quadrant].factor_x * 400) - 420,
        Math.max(0, quadrants[quadrant].factor_y * 400) - 420,
        440,
        440,
      ].join(' ');
    }

    var svg = d3
      .select('svg#' + config.svg_id)
      .style('background-color', config.colors.background)
      .attr('width', config.width)
      .attr('height', config.height);

    var radar = svg.append('g');
    if ('zoomed_quadrant' in config && config.zoomed_quadrant != null) {
      svg.attr('viewBox', viewbox(config.zoomed_quadrant));
    } else {
      radar.attr('transform', translate(config.width / 2, config.height / 2));
    }

    var grid = radar.append('g');

    // draw grid lines
    grid
      .append('line')
      .attr('x1', 0)
      .attr('y1', -330)
      .attr('x2', 0)
      .attr('y2', 330)
      .style('stroke', config.colors.grid)
      .style('stroke-width', 1);
    grid
      .append('line')
      .attr('x1', -330)
      .attr('y1', 0)
      .attr('x2', 330)
      .attr('y2', 0)
      .style('stroke', config.colors.grid)
      .style('stroke-width', 1);

    // background color. Usage `.attr("filter", "url(#solid)")`
    // SOURCE: https://stackoverflow.com/a/31013492/2609980
    var defs = grid.append('defs');
    var filter = defs
      .append('filter')
      .attr('x', 0)
      .attr('y', 0)
      .attr('width', 1)
      .attr('height', 1)
      .attr('id', 'solid');
    filter.append('feFlood').attr('flood-color', 'rgb(0, 0, 0, 0.8)');
    filter.append('feComposite').attr('in', 'SourceGraphic');

    // draw rings
    // eslint-disable-next-line
    for (var i = 0; i < rings.length; i++) {
      grid
        .append('circle')
        .attr('cx', 0)
        .attr('cy', 0)
        .attr('r', rings[i].radius)
        .style('fill', 'none')
        .style('stroke', config.colors.grid)
        .style('stroke-width', 1);
      if (config.print_layout) {
        grid
          .append('text')
          .text(config.rings[i].name)
          .attr('y', -rings[i].radius + 62)
          .attr('text-anchor', 'middle')
          .style('fill', config.rings[i].color)
          .style('opacity', 0.35)
          .style('font-family', 'Arial, Helvetica')
          .style('font-size', '42px')
          .style('font-weight', 'bold')
          .style('pointer-events', 'none')
          .style('user-select', 'none');
      }
    }

    function legend_transform(quadrant, ring, index = null) {
      var dx = ring < 2 ? 0 : 140;
      var dy = index == null ? -16 : index * 12;
      if (ring % 2 === 1) {
        dy = dy + 36 + segmented[quadrant][ring - 1].length * 12;
      }
      return translate(
        legend_offset[quadrant].x + dx,
        legend_offset[quadrant].y + dy
      );
    }

    // draw title and legend (only in print layout)
    if (config.print_layout) {
      // title
      radar
        .append('text')
        .attr('transform', translate(title_offset.x, title_offset.y))
        .text(config.title)
        .style('font-family', 'Arial, Helvetica')
        .style('font-size', '30')
        .style('font-weight', 'bold');

      // date
      radar
        .append('text')
        .attr('transform', translate(title_offset.x, title_offset.y + 20))
        .text(config.date || '')
        .style('font-family', 'Arial, Helvetica')
        .style('font-size', '14')
        .style('fill', '#999');

      // footer
      radar
        .append('text')
        .attr('transform', translate(footer_offset.x, footer_offset.y))
        .text('▲ moved up     ▼ moved down')
        .attr('xml:space', 'preserve')
        .style('font-family', 'Arial, Helvetica')
        .style('font-size', '10px');

      // legend
      var legend = radar.append('g');
      // eslint-disable-next-line
      for (var quadrant = 0; quadrant < 4; quadrant++) {
        legend
          .append('text')
          .attr(
            'transform',
            translate(legend_offset[quadrant].x, legend_offset[quadrant].y - 45)
          )
          .text(config.quadrants[quadrant].name)
          .style('font-family', 'sans-serif, Arial')
          .style('font-size', '18px')
          .style('font-weight', 'bold');
        // eslint-disable-next-line
        for (var ring = 0; ring < 4; ring++) {
          legend
            .append('text')
            .attr('transform', legend_transform(quadrant, ring))
            .text(config.rings[ring].name)
            .style('font-family', 'sans-serif, Arial')
            .style('font-size', '12px')
            .style('font-weight', 'bold')
            .style('fill', config.rings[ring].color);
          legend
            .selectAll('.legend' + quadrant + ring)
            .data(segmented[quadrant][ring])
            .enter()
            .append('a')
            .attr('href', function (d, i) {
              return d.link ? d.link : '#'; // stay on same page if no link was provided
            })
            // Add a target if (and only if) there is a link and we want new tabs
            .attr('target', function (d, i) {
              return d.link && config.links_in_new_tabs ? '_blank' : null;
            })
            .append('text')
            // eslint-disable-next-line
            .attr('transform', function (d, i) {
              return legend_transform(quadrant, ring, i);
            })
            .attr('class', 'legend' + quadrant + ring)
            .attr('id', function (d, i) {
              return 'legendItem' + d.id;
            })
            .text(function (d, i) {
              console.log('maov');
              console.log(d);
              console.log(d.id);
              console.log(d.label);
              return d.id + '. ' + d.label;
            })
            .style('font-family', 'Arial, Helvetica')
            .style('font-size', '11px');
        }
      }
    }

    // layer for entries
    var rink = radar.append('g').attr('id', 'rink');

    // rollover bubble (on top of everything else)
    var bubble = radar
      .append('g')
      .attr('id', 'bubble')
      .attr('x', 0)
      .attr('y', 0)
      .style('opacity', 0)
      .style('pointer-events', 'none')
      .style('user-select', 'none');
    bubble.append('rect').attr('rx', 4).attr('ry', 4).style('fill', '#333');
    bubble
      .append('text')
      .style('font-family', 'sans-serif')
      .style('font-size', '10px')
      .style('fill', '#fff');
    bubble.append('path').attr('d', 'M 0,0 10,0 5,8 z').style('fill', '#333');

    // eslint-disable-next-line
    function showBubble(d) {
      if (d.active || config.print_layout) {
        console.log('lmaoooooo');
        console.log(d);
        console.log(d.srcElement.__data__.label);
        var tooltip = d3
          .select('#bubble text')
          .text(d.srcElement.__data__.label);
        var bbox = tooltip.node().getBBox();
        d3.select('#bubble')
          .attr(
            'transform',
            translate(
              d.srcElement.__data__.x - bbox.width / 2,
              d.srcElement.__data__.y - 16
            )
          )
          .style('opacity', 0.8);
        d3.select('#bubble rect')
          .attr('x', -5)
          .attr('y', -bbox.height)
          .attr('width', bbox.width + 10)
          .attr('height', bbox.height + 4);
        d3.select('#bubble path').attr(
          'transform',
          translate(bbox.width / 2 - 5, 3)
        );
      }
    }

    function hideBubble() {
      d3.select('#bubble')
        .attr('transform', translate(0, 0))
        .style('opacity', 0);
    }

    function highlightLegendItem(d, id) {
      var legendItem = document.getElementById('legendItem' + id);
      legendItem.setAttribute('filter', 'url(#solid)');
      legendItem.setAttribute('fill', 'white');
    }

    function unhighlightLegendItem(d, id) {
      var legendItem = document.getElementById('legendItem' + id);
      legendItem.removeAttribute('filter');
      legendItem.removeAttribute('fill');
    }

    // draw blips on radar
    var blips = rink
      .selectAll('.blip')
      .data(config.entries)
      .enter()
      .append('g')
      .attr('class', 'blip')
      .attr('transform', function (d, i) {
        return legend_transform(d.quadrant, d.ring, i);
      })
      .on('mouseover', function (d) {
        console.log('d is');
        console.log(d);
        showBubble(d);
        highlightLegendItem(d, d.srcElement.__data__.id);
      })
      .on('mouseout', function (d) {
        hideBubble(d);
        unhighlightLegendItem(d, d.srcElement.__data__.id);
      });

    // configure each blip
    blips.each(function (d, i) {
      var blip = d3.select(this);

      blip = blip
        .append('a')
        .style('cursor', 'pointer')
        .on('click', function () {
          onBlipClick(blip._groups[0][0].__data__.label);
        });

      // blip shape
      if (d.moved > 0) {
        blip
          .append('path')
          .attr('d', 'M -11,5 11,5 0,-13 z') // triangle pointing up
          .style('fill', d.color);
      } else if (d.moved < 0) {
        blip
          .append('path')
          .attr('d', 'M -11,-5 11,-5 0,13 z') // triangle pointing down
          .style('fill', d.color);
      } else {
        blip.append('circle').attr('r', 9).attr('fill', d.color);
      }

      // blip text
      if (d.active || config.print_layout) {
        var blip_text = blip._groups[0][0].__data__.id;
        blip
          .append('text')
          .text(blip_text)
          .attr('y', 3)
          .attr('text-anchor', 'middle')
          .style('fill', '#fff')
          .style('font-family', 'Arial, Helvetica')
          .style('font-size', function (d) {
            return blip_text.length > 2 ? '8px' : '9px';
          })
          .style('pointer-events', 'none')
          .style('user-select', 'none');
      }
    });

    // make sure that blips stay inside their segment
    function ticked() {
      blips.attr('transform', function (d) {
        return translate(d.segment.clipx(d), d.segment.clipy(d));
      });
    }

    // distribute blips, while avoiding collisions
    d3.forceSimulation()
      .nodes(config.entries)
      .velocityDecay(0.19) // magic number (found by experimentation)
      .force('collision', d3.forceCollide().radius(12).strength(0.85))
      .on('tick', ticked);
  }

  const { status, data, error } = useGetAllEntries();
  const [modalIsOpen, setIsOpen] = useState(false);
  const [addTechnologyModalIsOpen, setAddTechnologyModalIsOpen] =
    useState(false);

  const handleModalClose = () => {
    setIsOpen(false);
  };

  const handleAddTechnologyModalOpen = () => {
    setAddTechnologyModalIsOpen(true);
  };

  const handleAddTechnologyModalClose = () => {
    setAddTechnologyModalIsOpen(false);
  };

  function saveEntries() {
    console.log('save entries');
    axios.put(
      'https://expressjs-prisma-production-53f4.up.railway.app/saveEntries',
      myBlips
    );
  }

  const svgRef = useRef();

  const cleanSvg = () => {
    d3.select('svg#radar').selectAll('g').remove();
  };

  useEffect(() => {
    if (status === 'success') {
      console.log(data);
      setBlips(data);
    }
  }, [status, data]);

  useEffect(() => {
    const runVisualization = (mydata) => {
      const newArray = mydata.map((item, i) => {
        const newItem = {
          ...item,
          id: i,
        };
        return newItem;
      });

      radar_visualization({
        svg_id: 'radar',
        width: 1450,
        height: 1000,
        colors: {
          background: '#fff',
          grid: '#dddde0',
          inactive: '#ddd',
        },
        title: 'BMW Group Tech Radar made by Atalay',
        date: '2023.06',
        quadrants: [
          { name: 'Languages' },
          { name: 'Infrastructure' },
          { name: 'Datastores' },
          { name: 'Frameworks and Libraries' },
        ],
        rings: [
          { name: 'ADOPT', color: '#5ba300' },
          { name: 'TRIAL', color: '#009eb0' },
          { name: 'ASSESS', color: '#c7ba00' },
          { name: 'HOLD', color: '#e09b96' },
        ],
        print_layout: true,
        links_in_new_tabs: true,
        //zoomed_quadrant: zoomed_quadrant,
        //ENTRIES
        entries: newArray,
        //ENTRIES
      });
    };

    cleanSvg();

    runVisualization(myBlips);
  }, [myBlips]);

  const runVisualization2 = (mydata) => {
    const newArray = mydata.map((item, i) => {
      const newItem = {
        ...item,
        id: i,
      };
      return newItem;
    });

    radar_visualization({
      svg_id: 'radar',
      width: 1450,
      height: 1000,
      colors: {
        background: '#fff',
        grid: '#dddde0',
        inactive: '#ddd',
      },
      title: 'BMW Group Tech Radar made by Atalay',
      date: '2023.06',
      quadrants: [
        { name: 'Languages' },
        { name: 'Infrastructure' },
        { name: 'Datastores' },
        { name: 'Frameworks and Libraries' },
      ],
      rings: [
        { name: 'ADOPT', color: '#5ba300' },
        { name: 'TRIAL', color: '#009eb0' },
        { name: 'ASSESS', color: '#c7ba00' },
        { name: 'HOLD', color: '#e09b96' },
      ],
      print_layout: true,
      links_in_new_tabs: true,
      entries: newArray,
    });
  };

  const addTechnology = (e) => {
    e.preventDefault();
    console.log('add');
    setIsOpen(false);
    const tempBlips = [
      ...myBlips,
      {
        label: label,
        quadrant: parseInt(quadrant),
        ring: parseInt(ring),
        active: true,
        moved: 0,
      },
    ];
    setBlips(tempBlips);
    setLabel('');
  };

  const deleteTechnology = () => {
    console.log('delete');
    console.log(label);
    setIsOpen(false);
    const tempBlips = myBlips.filter((blip) => blip.label !== label);
    setBlips(tempBlips);
  };

  const resetTechRadar = () => {
    cleanSvg();
    runVisualizationEmpty();
    setBlips([]);
  };

  const [dialogOnState, setDialogOnState] = useState(false);

  const onAcceptClick = () => {
    setDialogOnState(false);
    saveEntries();
  };

  const onCancelClick = () => {
    setDialogOnState(false);
  };

  const onNavbarSaveClick = () => {
    setDialogOnState(true);
  };

  const getTechRadarFromDb = () => {
    queryClient.invalidateQueries('entries');
    setBlips(data);
    cleanSvg();
    runVisualization2(data);
  };

  const onEditBlipModalSubmit = (e) => {
    e.preventDefault();
    console.log(e);
    console.log('submit running');

    console.log('myblips');
    console.log(myBlips);
    const tempBlips = myBlips.map((blip) => {
      console.log('blip.label');
      console.log(blip.label);
      if (blip.label === label) {
        const obj = {
          ...blip,
          quadrant: parseInt(quadrant),
          ring: parseInt(ring),
        };

        console.log('objj');
        console.log(obj);
        return {
          ...blip,
          quadrant: parseInt(quadrant),
          ring: parseInt(ring),
        };
      }
      return blip;
    });
    setIsOpen(false);
    setBlips(tempBlips);
    setQuadrant(0);
    setRing(0);
    setLabel('');
  };

  const handleLabelChange = (e) => {
    console.log('handleLabelChange');
    console.log(e.target.value);
    setLabel(e.target.value);
  };

  const handleQuadrantChange = (e) => {
    console.log('handleQuadrantChange');
    setQuadrant(e.target.value);
  };

  const handleRingChange = (e) => {
    console.log(e.target.value);
    setRing(e.target.value);
  };

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (status === 'error') {
    return <div>{error.message}</div>;
  }

  return (
    <div className='App'>
      <WarningDialog
        dialogOnState={dialogOnState}
        onAcceptClick={onAcceptClick}
        onCancelClick={onCancelClick}
      />
      <AddTechnologyModal
        showModal={addTechnologyModalIsOpen}
        handleModalClose={handleAddTechnologyModalClose}
        label={label}
        quadrant={quadrant}
        handleLabelChange={handleLabelChange}
        handleQuadrantChange={handleQuadrantChange}
        handleRingChange={handleRingChange}
        ring={ring}
        handleModalSubmit={addTechnology}
      />
      <ModalComponent
        showModal={modalIsOpen}
        handleModalClose={handleModalClose}
        label={label}
        quadrant={quadrant}
        handleQuadrantChange={handleQuadrantChange}
        handleRingChange={handleRingChange}
        ring={ring}
        handleModalSubmit={onEditBlipModalSubmit}
        handleModalDelete={deleteTechnology}
      />
      <Navbar
        handleAddTechnologyModalOpen={handleAddTechnologyModalOpen}
        resetTechRadar={resetTechRadar}
        getTechRadarFromDb={getTechRadarFromDb}
        onSaveClick={onNavbarSaveClick}
      />
      <svg className='pt-8' id='radar' ref={svgRef}></svg>
      <Description />
    </div>
  );
}

export default App;

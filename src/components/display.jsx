"use strict";

// 3 decimal places for pValue, 1 for others

var React = require('react')

function Loading() {
  return <div style={{
    color: 'crimson',
    fontSize: '48px',
    position: 'absolute',
    top: 150,
    left: 16
  }}>Loading...</div>
}


module.exports = React.createClass({
  displayName: 'Display',

  getInitialState() {
    return {
      pValueThreshhold: 1,
      hoveredGene: null,
      focusedGene: null,
      focusedGeneInBrushed: false,
    }
  },

  componentDidMount() {
    window.addEventListener('keydown', e => {
      switch(e.code) {
      case "KeyJ":
        this.focusNextGene();
        break;
      case "KeyK":
        this.focusPreviousGene();
        break;
      }
    });
  },

  focusNextGene() {
    var { savedGenes, brushedGenes } = this.props
      , { focusedGene, focusedGeneInBrushed } = this.state

    savedGenes = savedGenes.toList();
    brushedGenes = brushedGenes.toList();

    if (!focusedGene) {
      if (savedGenes.size) {
        this.setFocusedGene(savedGenes.first());
      } else if (brushedGenes.size) {
        this.setFocusedGene(brushedGenes.first(), true);
      }
    } else if (focusedGeneInBrushed) {
      let idx = brushedGenes.indexOf(focusedGene);

      if (idx + 1 !== brushedGenes.size) {
        this.setFocusedGene(brushedGenes.get(idx + 1), true);
      }
    } else {
      let idx = savedGenes.indexOf(focusedGene);

      if (idx + 1 !== savedGenes.size) {
        this.setFocusedGene(savedGenes.get(idx + 1));
      } else if (brushedGenes.size) {
        this.setFocusedGene(brushedGenes.first(), true);
      }
    }
  },

  focusPreviousGene() {
    var { savedGenes, brushedGenes } = this.props
      , { focusedGene, focusedGeneInBrushed } = this.state

    savedGenes = savedGenes.toList();
    brushedGenes = brushedGenes.toList();

    if (!focusedGene) {
      this.focusNextGene();
    } else if (focusedGeneInBrushed) {
      let idx = brushedGenes.indexOf(focusedGene);

      if (idx !== 0) {
        this.setFocusedGene(brushedGenes.get(idx - 1), true);
      } else if (savedGenes.size) {
        this.setFocusedGene(savedGenes.last());
      }

    } else {
      let idx = savedGenes.indexOf(focusedGene);

      if (idx > 0) {
        this.setFocusedGene(savedGenes.get(idx - 1));
      }
    }
  },

  setFocusedGene(focusedGene, focusedGeneInBrushed=false) {
    this.setState({ focusedGene, focusedGeneInBrushed });
  },

  setHoveredGene(hoveredGene) {
    this.setState({ hoveredGene });
  },

  setPValueThreshhold(pValueThreshhold) {
    this.setState({ pValueThreshhold });
  },

  render: function () {
    var LeftPanel = require('./left/component.jsx')
      , RightPanel = require('./right/component.jsx')
      , { loading } = this.props

    return (
      <div>
        <LeftPanel
            {...this.props}
            {...this.state}
            setPValueThreshhold={this.setPValueThreshhold} />

        <RightPanel
            {...this.props}
            {...this.state}
            setFocusedGene={this.setFocusedGene}
            setHoveredGene={this.setHoveredGene} />
        { loading && <Loading /> }
      </div>
    )
  }
});

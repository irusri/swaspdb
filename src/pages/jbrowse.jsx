import React from 'react'
import "@fontsource/roboto";
import {
  createViewState,
  createJBrowseTheme, 
  JBrowseLinearGenomeView,
  ThemeProvider,
} from '@jbrowse/react-linear-genome-view'
//import GWAS from "jbrowse-plugin-gwas";
import { observer } from "mobx-react";
import InputLabel from '@material-ui/core/InputLabel';

const theme = createJBrowseTheme()

const assembly = {
  name: 'Potra v2.2',
  sequence: {
    type: 'ReferenceSequenceTrack',
    trackId: 'potrav22-ReferenceSequenceTrack',
    adapter: {
      type: 'BgzipFastaAdapter',
      fastaLocation: {
        uri:
          'https://api.plantgenie.org/data/Potra02_genome.fasta.gz',
      },
      faiLocation: {
        uri:
          'https://api.plantgenie.org/data/Potra02_genome.fasta.gz.fai',
      },
      gziLocation: {
        uri:
          'https://api.plantgenie.org/data/Potra02_genome.fasta.gz.gzi',
      },
    },
  }
}

const tracks = [
  {
    type: 'FeatureTrack',
    trackId: 'ncbi_refseq_109_hg38',
    name: ' Genes ',
    assemblyNames: ['Potra v2.2'],
    category: ['Annotation'],
    adapter: {
      type: 'Gff3TabixAdapter',
      gffGzLocation: {
        uri:
          'https://api.plantgenie.org/data/Potra02_genes.gff.gz',
      },
      index: {
        location: {
          uri:
            'https://api.plantgenie.org/data/Potra02_genes.gff.gz.tbi',
        },
      },
    },
  },
  { type: 'FeatureTrack',
    trackId: 'Acetyl_cinnamoyl_salicortin_C31H32O12',
    name: ' Acetyl_cinnamoyl_salicortin_C31H32O12 ',
    assemblyNames: ['Potra v2.2'],
    category: ['Phenotypes'],
    adapter: {
      type: 'BedTabixAdapter', 
      bedGzLocation: {
        uri:
          'https://api.plantgenie.org/data/gwas/Acetyl_cinnamoyl_salicortin_C31H32O12.txt.gz',
      },
      index: {
        location: {
          uri:
            'https://api.plantgenie.org/data/gwas/Acetyl_cinnamoyl_salicortin_C31H32O12.txt.gz.tbi',
        },
      }, 
    //scoreColumn: "neg_log_pvalue" 
    }, 
    //displays: [{ type: "LinearManhattanDisplay", displayId: "Acetyl_cinnamoyl_salicortin_C31H32O12.txt.gz" }]  
    }
    ]

const defaultSession = {
  name: 'My session',
  view: {
    id: 'linearGenomeView',
    type: 'LinearGenomeView',
    tracks: [
      {
        type: 'ReferenceSequenceTrack',
        configuration: 'potrav22-ReferenceSequenceTrack',
        displays: [
          {
            type: 'LinearReferenceSequenceDisplay',
            configuration:
              'potrav22-ReferenceSequenceTrack-LinearReferenceSequenceDisplay',
          },
        ],
      },
      {
        type: 'FeatureTrack',
        configuration: 'ncbi_refseq_109_hg38',
        displays: [
          {
            type: 'LinearBasicDisplay',
            configuration: 'ncbi_refseq_109_hg38-LinearBasicDisplay',
          },
        ],
      },
      {
        type: 'FeatureTrack',
        configuration: 'Acetyl_cinnamoyl_salicortin_C31H32O12',
        displays: [
          {
            type: 'LinearManhattanDisplay',
            configuration: 'Acetyl_cinnamoyl_salicortin_C31H32O12-LinearManhattanDisplay',
          },
        ],
      },
    ],
    plugins: [
      {
        name: "gwas",
        url: "https://api.plantgenie.org/data/jbrowse-plugin-gwas.umd.production.min.js"
      }
    ]
  }, 
}

const jbrowse = observer(({ appState }) => {
  const state = createViewState({
    assembly,
    tracks,
    location: (appState.GenIE.selectedSNP).split("_")[0],
  // location: (appState.GenIE.selectedSNP).split("_")[0]+":"+parseInt((appState.GenIE.selectedSNP).split("_")[1])+".."+parseInt((appState.GenIE.selectedSNP).split("_")[1])+1000,
    defaultSession,
  })


  return (
    <>
      <InputLabel htmlFor="my-input">&nbsp;&nbsp;&nbsp;<b>
        
      </b></InputLabel>
    <ThemeProvider theme={theme}>
      <JBrowseLinearGenomeView viewState={state} />
    </ThemeProvider>
    </>
  )
});

export default jbrowse;
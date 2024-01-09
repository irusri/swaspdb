import { observable ,configure,action} from 'mobx'
import { create, persist } from 'mobx-persist'
import axios from 'axios'

const appState = observable({
    count: 10,
    GenIE :{
      baseURL:"https://beta.plantgenie.org/",
      allGenelists: {},
      activeGenelist: {},
      allExperiments: {},
      activeExperiment: {},
      allDatabases: {},
      userID: "",
      selectedspeciesAbbreviation: "",
      genelistDatabase: "",
      selectedDatabase: "Catechin_C15H14O6",
      selectedSNP:"chr1_30721368,chr1_30722285,chr1_30723357,chr1_30724146,chr18_10345176",
      currentFDR:0.8,
      selectedGenes:"Potra2n17c31668,Potra2n17c31667,Potra2n17c31661,Potra2n17c31765",
      selectedGene:"Potra2n17c31668",
      selectedSpecies:"",
      db:[],
      databaseURL : "https://api.plantgenie.org/db",
      genelistURL : "https://api.plantgenie.org/genelist/get_active_list", 
      experimentURL : "https://api.plantgenie.org/experiment",
      expressionURL : "https://api.plantgenie.org/experiment/expression",
      networkURL : "https://api.plantgenie.org/experiment/network"
    },
    decCounter:action(function() {
      appState.count -= 1;
    }),
    incCounter: action(function () {
      appState.count += 1; 
    }),
    fetchDB: action(async function () {
      try {
        const response = await axios.get('https://api.plantgenie.org/swaspdb/get_all_phenotypes') 
        appState.GenIE.db=response.data;
      } catch (error) {
       
      }
    }),
  
  }); 

const schema = {
    count: true,
    GenIE: {
        type: 'object', 
        schema: {
            db: {
                type: 'list'
            },
            baseURL:true,
            selectedDatabase: true,
            genelistDatabase:true,
            selectedSNP:true,
            selectedGenes:true,
            selectedGene:true,
            userID:true,
            currentFDR:true
           
        }
    }
    
}

const hydrate = create({
    storage: localStorage,
    jsonify: true,
});

configure({
    enforceActions: "never",
    isolateGlobalState: true
})

var someStore = persist(schema)(appState)
hydrate('genie', someStore).then(() => console.log('someStore has been hydrated'))
export default someStore;
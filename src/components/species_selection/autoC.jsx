import React, { useState, useEffect, useMemo } from "react";
import axios from 'axios';
import styled from 'styled-components';
import { observer } from "mobx-react";


const Wrapper = styled.div`
  position: relative;
  width: 40vw;
  margin: 10px auto;
  &, * { box-sizing: border-box;}
  h1 {
    text-align: left;
    color: #0025ff;
  }
  ul {
    position: absolute;
    width: 100%;
    padding: 0;
    margin: 0;
    border: 2px solid #eee;
    margin-top: -20px;
    padding-top: 20px;
    border-radius: 5px;
  }
  input {
    position: relative;
    z-index: 2;
  }
`;  

const Input = styled.input`
  height: 40px;
  width: 50%;
  border-radius: 20px;
  border: 2px solid #eee;
  outline: none;
  padding: 0 20px;
  font-size: 1.1rem;
  transition: all 0.1s;

  &:hover {
    border-color: #ddd;
  }

  &:focus {
    border-color: #0055ff;
    background: #fafafa;
  }
`;

const ResultItem = styled.li`
  display: flex;
  background: ${props => props.focus ? "#f0f0f0" : "white"};
  list-style: none;
  height: 40px;
  line-height: 30px;
  padding: 0 10px;
  cursor: pointer;
  align-items: center;

  img {
    height: 20px;
    border-radius: 50%;
    margin-right: 10px;
  }
`;


//const Autocomplete = () => {
const Autocompletex = observer(({ appState }) => {    
  const [results, setResults] = useState(null);
  const [hoveredIdx, setHoveredIdx] = useState(0);
  const [query, setQuery] = useState('');
  const [value, setValue] = useState();
  const [focused, setFocused] = useState(false);

  const search = async query => {
    if (!query) return;
  //  const res = await axios(`http://localhost:3000/search?q=${query}`);
  const finalVar={"q":query,"phenotype_name":appState.GenIE.selectedDatabase,"fdr":appState.GenIE.currentFDR}
  //  const res = await axios(`https://api.plantgenie.org/swaspdb/search?q=${query}&fdr=${}&`);
  const url="https://api.plantgenie.org/swaspdb/search";
    const res = await axios.post(url,finalVar) 
    setResults(res.data);
  };

  const handleKey = evt => {
    switch (evt.key) {
      case 'ArrowDown':
      case 'ArrowUp':
        let newIdx = hoveredIdx + (evt.key === "ArrowDown" ? 1 : -1);
        if (newIdx < 0) newIdx = results.length - 1;
        if (newIdx >= results.length) newIdx = 0;
        setHoveredIdx(newIdx);
        break;
      
      case 'Enter':
        let res = results[hoveredIdx];
        if (res) {
          select(res);
          setFocused(false);
        }
        break;
      
      default:
        search(query);
        return;
    }
  }

  const select = result => {
    setValue(result);
  }

  const hide = () => {
    setTimeout(() => setFocused(false), 100);
  };
  
  const handleClick = () => {
    if (results && hoveredIdx) {
      let res = results[hoveredIdx];
      if (res) {
        select(res);
        setFocused(false);
      }
    }
  };
  
  useEffect(() => {
    if (!results) return;
    const current = results[hoveredIdx];
    setQuery(`${current.snp_id}`);//${current.gene_id}
    appState.GenIE.selectedGene=current.snp_id;
  }, [hoveredIdx])

  useEffect(() => {
  //  if (onChange) onChange(value);
  }, [value]);

  return (
    <Wrapper>
      <Input
        type="text"
        placeholder="Type in SNP ID or gene ID"
        onChange={(evt) => {
          setQuery(evt.target.value);
          setFocused(true);
        }}
        onClick={handleClick}
        onKeyDown={handleKey}
        value={query}
        onFocus={() => setFocused(true)}
        onBlur={hide}
      />
      {results && focused && (
        <ul className="results">
          {results.map((result, idx) => (
            <ResultItem
              key={idx}
              focus={idx === hoveredIdx}
              onMouseEnter={() => setHoveredIdx(idx)}
               onClick={ () => {
              //   console.log("snp id"+result.snp_id);
              
                 select(result);
               } } 
            >
            <li>

              {result.snp_id} - <span>{result.gene_id}</span>
              </li>
            </ResultItem>
          ))}
        </ul>
      )}
    </Wrapper>
  );
});

export default Autocompletex;
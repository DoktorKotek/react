import React, { useState, useEffect } from "react";
import ReactDom from "react-dom";
import "./styles.css";

/**
 Сделай так, чтобы в приложении все классы заменились на функциональные компоненты, для этого используй Hooks
 
 Импортировать нужные хуки можно так:
 import React, { useState } from "react";
 
 Список хуков, которые могут пригодиться: useState, useRef, useEffect
 */

function App() {
  const [blockIds, setBlockIds] = useState([])
  const [, setLastBlockId] = useState(0)
  const removeLast = () => {
    setBlockIds(blockIds.slice(0, blockIds.length - 1))
  }
  const addNew = () => {
    setLastBlockId(prevBlockId => {
      const newLastBlockId = prevBlockId + 1
      setBlockIds([...blockIds, newLastBlockId])
      return newLastBlockId
    })
  }
  
  return (
    <div className="page">
      <div className="controlPanel">
        <button
          type="button"
          onClick={removeLast}
          className="actionButton"
        >
          -
        </button>
        <button type="button" onClick={addNew} className="actionButton">
          +
        </button>
      </div>
      <div className="container">
        {blockIds.map(blockId => (
          <CounterBlock key={blockId} />
        ))}
      </div>
    </div>
  );
}

function CounterBlock() {
  const [value, setValue] = useState(0)
  useEffect(() => {
    // componentDidMount
    const timerId = setInterval(() => {
      setValue(prevValue => prevValue + 1);
    }, 1000)
    return () => {
      // componentWillUnmount
      clearInterval(timerId)
    }
  }, [])
  return <div className="block">{value}</div>;
}


ReactDom.render(<App />, document.getElementById("app"));

import './App.css';
import React, {useEffect, useState} from "react";
import Info from "./Info"
import axios from "axios"
import AStar from "./AStar";

function App() {
    const [map, setMap] = useState([])
    const [rows,setRows] = useState(8)
    const [cols,setCols]= useState(10)
    const [walls, setWalls] = useState([])
    const [start,setStart] = useState(0)
    const [end,setEnd] = useState(0)
    const [isSubmit, setIsSubmit] = useState(false)
    const [clickMode, setClickMode] = useState('start')
    const [date, setDate] = useState('')
    const [distance, setDistance] = useState(0)
    const [IP, setIP] = useState("")
    const [time, setTime] = useState('')
    const [isCashed, setIsCashed] = useState(false)

    const COLORS = {
        START:"#66FFAD",
        END:"#F52448",
        EMPTY:"#273568",
        WALL:"#677CC7"
    }

    useEffect(() => {
        const getIP = async () => {
            try {
                const res = await axios.get('https://geolocation-db.com/json/')
                setIP(res.data.IPv4)
            } catch (err) {
                console.log(err)
            }
        };

        setMapState()
        getIP();

    }, [])
    //changing the mode
    const handleModeChange = (e,clickMode,array=[]) => {
        switch(clickMode){
            case "start":
                handleToggle(e,"start")
                break;
            case "end":
                handleToggle(e,"end")
                break;
            case "wall":
                setMultipleSquares(e)
                cleanPreviousPath()
                break;
            default:
                return
        }
    }
    const hashCode = (str)=>{
        let hash = 0, i, chr
        if(str.length===0) return hash;
        for(i=0;i<str.length;i++){
            chr = str.charCodeAt(i)
            hash = ((hash<<5)-hash)+chr
            hash |=0
        }
        return hash;
    }
    //ADDING WALLS, START AND END POINTS
    const setMultipleSquares =(e)=>{

        let isWall = false
        let color = isWall?COLORS.WALL:COLORS.EMPTY
        let squarePosition = e.currentTarget.id.split("-")
        addSquares(squarePosition,{wall:isWall,color:color})
    }
    const addSquares = (squarePosition,object)=>{
        let grid = map
        if(grid[squarePosition[0]][squarePosition[1]].wall===undefined||grid[squarePosition[0]][squarePosition[1]].wall===false){
            grid[squarePosition[0]][squarePosition[1]] = {wall:true,color:COLORS.WALL}
        }
        else{
            grid[squarePosition[0]][squarePosition[1]] = {wall:false,color:COLORS.EMPTY}
        }
        setMap(grid)
        setWalls(object)
    }
    //add toggling
    const handleToggle = (e, stateKey) => {
        let squarePosition = e.currentTarget.id.split("-")
        if(stateKey=="start") {
            Promise.resolve(cleanSquare(start,{wall:false, color:COLORS.EMPTY}))
                .then(() => addSquare(squarePosition, {wall:false, color:COLORS.START}, stateKey))
        }
        if(stateKey=="end")Promise.resolve(cleanSquare(end,{wall:false, color:COLORS.EMPTY}))
            .then(() => addSquare(squarePosition, {wall:false, color:COLORS.END}, stateKey))

        cleanPreviousPath()


    }
    const cleanPreviousPath = ()=>{
        let grid = map
        for(let i=0;i<grid.length;i++){
            for(let j=0;j<grid[0].length;j++){
                if(grid[i][j].color=="skyblue")grid[i][j].color=COLORS.EMPTY
            }
        }
        setMap(grid)
    }
    //for toggling
    const cleanSquare = (squarePosition,object) => {
        if(!!squarePosition){
            let grid =  map
            grid[squarePosition[0]][squarePosition[1]] = object
            return setMap(grid)
        }
        return
    }
    const addSquare = (squarePosition,object,stateKey)=>{
        let grid =  map
        grid[squarePosition[0]][squarePosition[1]] = object
        setMap(grid)
        if(stateKey=="start"){
            setStart(squarePosition)
        }
        if(stateKey=="end"){
            setEnd(squarePosition)
        }
    }
    //PATH FINDING
    const handleFindPath = async(e)=>{
        cleanPreviousPath()
        e.preventDefault()
        let grid = map
        setIsSubmit(false)
        //start and end are both selected
        if(start&&end){
            let newPath = {
                x1: start[1],
                x2: end[1],
                y1: start[0],
                y2: end[0],
                trace: [],
                time: 0,
                IP: IP,
                matrixKey:hashCode(getMatrixKey().toString())
            };
            try{
                let startToDb = performance.now() //calc time of connection to DB
                const res = await axios.post("/",newPath)
                let endToDb = performance.now()
                if(res.data==null){
                    let aStar = new AStar(start,end,grid)
                    let startTime = performance.now()
                    aStar.startPathFinding()
                    let endTime = performance.now()
                    let path = aStar.path
                    let dist = -1
                    if(path!=null) dist = path.length-1
                        if(path!=null) {
                        path.forEach((point, i) => {
                            if (i == 0 || i == path.length-1) {
                                return
                            }
                            newPath.trace.push([Number(point.row),Number(point.column)])
                        })
                    }

                    drawPath(newPath.trace)
                    newPath.time = Number((endTime - startTime).toPrecision(4))


                    try{
                        const res2 =  axios.post("/add", newPath)

                        //saving

                        setDistance(dist)
                        setIsCashed(false)
                        setTime(Number((endTime - startTime).toPrecision(4)))
                    }catch(err){
                        console.log(err)
                    }
                }
                else{
                    //drawing
                    drawPath(res.data.trace)
                    setDistance((res.data.trace != null) ? res.data.trace.length - 1 : -1)
                    setTime(Number((endToDb - startToDb).toPrecision(4)))
                    setIsCashed(true)
                }
            }catch(err){
                console.log(err)
            }

            //SAVING
            let d = new Date()
            let time = `${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}`
            let date = `${d.getDate()} ${d.getMonth()} ${d.getFullYear()}`
            setDate(date.toString() + " " + time.toString())
            setMap(grid)
            setIsSubmit(true)
        }
    }
    const getGridForAStar=()=>{
        let grid = map
        let searchMap = new Array(grid.length)
        for(let i=0;i<grid.length;i++){
            searchMap[i] = new Array(grid[0].length)
            for(let j=0;j<grid[0].length;j++){
                if(grid[i][j].wall===true) searchMap[i][j]=0
                else searchMap[i][j]=1
            }
        }
        return searchMap
    }
    //DRAW
    const drawPath = (trace)=>{
        let grid = map
        if(trace!=null){
            trace.forEach((item)=>{
                grid[item[0]][item[1]] = {color: "skyblue", wall: false}
            })
        }
        setMap(grid)
    }

    const getMatrixKey=()=>{
        let grid = getGridForAStar()
        let matrixKey = ''
        for(let i = 0;i<grid.length;i++){
            for(let j = 0;j<grid[0].length;j++){
                matrixKey+=grid[i][j].toString()
            }
        }
       return matrixKey
    }
    //MAP RENDERING
    const setMapState = (num1=8,num2=10) => {
        let grid =new Array(num1)
        for(let i=0;i<num1;i++){
            grid[i]= new Array(num2).fill({wall:false, color: "#273568"})
        }
        setMap(grid)
    }
    const renderGrid = () => {
        let grid = map
        return <div>{grid.map((row, i)=><div style={{display: 'flex'}}>{row.map((element, j)=><div  id={`${i}-${j}`} onClick={(e) => handleModeChange(e, clickMode, [i, j])} style={{
            height: "40px",
            overflowX: 'hidden',
            width: '40px',
            borderStyle: 'solid',
            borderWidth:"thin",
            backgroundColor: element.color,
            fontSize: '20px',
            lineHeight: '100px',
            textAlign: 'center'
        }}/>)}</div>)}</div>

    }
    const handleChangeRows = (e)=>{
        setRows(Number(e.target.value))
    }
    const handleChangeCols = (e)=>{
        setCols(Number(e.target.value))
    }

    const clear = async () => {
        await setMapState(0,0)
        setMapState(rows,cols)
    }
    const selectMode = (e) =>{
        setClickMode(e.target.name)
    }

    return (
        <div className="App">
            <div className="main-container">
                <div  className="canvas">
                    {renderGrid()}
                    <button className="clear" onClick={()=>clear()} name="clear">Reset map</button>
                    <div style={{color: "white"}} className="reset">
                        <label  htmlFor="rows">Set new grid dimension</label>
                        <div className="rows">
                            <span>rows:</span>
                            <input type="text" id="rows" value={rows} onChange={(e) => handleChangeRows(e)}/>
                        </div>
                        <div className="columns">
                            <span>columns:</span>
                            <input type="text" name="cols" value={cols} onChange={(e) => handleChangeCols(e)}/>
                        </div>

                    </div>
                </div>
                <div className="routeContainer">
                    <div className="buttons">
                        <button onClick={(e)=>selectMode(e)} name="start">Start point</button>
                        <button onClick={(e)=>selectMode(e)} name="end">End point</button>
                        <button onClick={(e)=>selectMode(e)} name="wall">Wall</button>
                        <button onClick={(e)=>handleFindPath(e)} className="findRoute">Find the route</button>

                    </div>
                    <Info isCashed={isCashed} IP={IP}  distance={distance} time={time} date={date} isSubmit={isSubmit} />

                </div>

            </div>
        </div>
    );
}

export default App;

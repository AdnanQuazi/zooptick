import "../../styles/index.css";
function SearchWindow({ data, setFieldValue }) {
    if(data == '' || data.length < 1) return <></>
    const setItem = (item)=>{
        console.log({item})
        setFieldValue('subCategory',item)
    }
  return (
    <>
      <div className="search-window" >
        <ul>
         {data.map((elem,i )=> {
            if(typeof elem.item == 'string') return <li key={i} onClick={()=> setItem(elem.item)}>{elem.item}</li>
         })}
        </ul>
      </div>
    </>
  );
}
export default SearchWindow
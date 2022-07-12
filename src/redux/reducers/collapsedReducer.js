export const collapsedReducer = (prevState={
    isCollapsed:false
},action) =>{
    //console.log(action)
    let {type} = action
    switch(type){
        case "change_collapsed":
            let newState = {...prevState}
            newState.isCollapsed = !newState.isCollapsed
            return newState
        default:
            return prevState
    }
}
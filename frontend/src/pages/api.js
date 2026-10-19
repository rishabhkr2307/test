export async function api(path, {method='GET', body}={}){
    const res=await fetch(path,{
        method, credentials:'include',
        headers:body?{'Content-Type':'application/json'}:undefined,
        body: body?JSON.stringify(body): undefined
    })
    let data=null
    try{
        data=await res.json()}
        catch{}
        if(!res.ok){
            const err=new Error(data?.error || `request (${res.status})`)
            err.status=res.status
            throw err
    }
    return data
}
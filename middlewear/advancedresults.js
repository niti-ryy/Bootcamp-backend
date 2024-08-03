const advanceResults=(model,populate)=> async(req,res,next)=>{
    let query;
    
    // Create a copy of req.query
    const reqQuery = { ...req.query };
    
    // Fields to exclude
    const removeFields = ["select","sort","limit","skip","page"];
    
    // Loop over removeFields and remove them from reqQuery
    removeFields.forEach(param => delete reqQuery[param]);
    
    // Create query string
    let queryStr = JSON.stringify(reqQuery);
    
    // Create operators ($gt, $gte, $lt, $lte, $in)
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);
    
    // Finding resource
    query = model.find(JSON.parse(queryStr))
    
    // Selecting fields
    if (req.query.select) {
        const fields = req.query.select.split(",").join(" ");
        query = query.select(fields);
    }
    
    //sorting  based on result
    if(req.query.sort){
        const sortBy = req.query.select.split(",").join(" ");
        query = query.sort("name")
    }

    //Pagination
    const page=parseInt(req.query.page,10) || 1
    const limit=parseInt(req.query.limit,10) || 1
    const startIndex=(page-1)*limit    //it is meant for tracking no of documetns ot skip in the pagiantion process
    const endIndex=page * limit
    const total=await model.countDocuments()

    query=query.skip(startIndex).limit(limit)   //no of documetns to skip

    if(populate){
        query=query.populate(populate)
    }
    // Executing query
    const  result = await query;

    console.log(result)

    //Pagination Reesult
    const pagination={}

    if(endIndex < total) {    //iof end index is less total doc then there is not next page
        pagination.next={
            page:page+1,
            limit
        }
    }else{
        pagination.error={
            page:"error",
            limit:"end of document"
        }
    }
    
    if(startIndex > 0){    //if the start index is less than 0 then there is not prev page
        pagination.prev={
            page:page-1,
            limit
        }
    }

    res.advanceResults={
        success:true,
        count:result.length,
        data:result,
        pagination
    }

    console.log(advanceResults)
    next();
}

module.exports=advanceResults



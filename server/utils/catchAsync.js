const catchAsync = (callback) => {
    try {
        callback();
    } catch(error){
        console.log(error);
    }
}

export default catchAsync;
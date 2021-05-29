class BlogError extends Error{
   constructor(message, status){
       super();
       this.message = message;
       this.status = status;
   } 
}

module.exports = BlogError;
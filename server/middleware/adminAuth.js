import jwt from 'jsonwebtoken'

const adminAuth = async(req, res, next)=>{
    try{
        const {token} = req.headers;
        if(!token){
            return res.json({
                success: false,
                message: 'Not Authorizes, try again'
            })
        }
        const decode_token = jwt.verify(token, process.env.JWT_SECRET);
        const {isAdmin} = decode_token

        if(!isAdmin){
            res.json({
                success:false,
                message: 'Not Authorizes, try again'
            })
        }
        next();

    }catch(error){
        console.log('Admin auth error', error)
        res.json({
            success:false,
            message: error?.message
        })
    }
}

export default adminAuth;
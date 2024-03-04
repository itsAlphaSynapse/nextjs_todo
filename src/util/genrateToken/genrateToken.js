import jwt from 'jsonwebtoken';

const genrateToken = (payload, expiresIn) => {
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '48h' })
    return token;
}

export default genrateToken;
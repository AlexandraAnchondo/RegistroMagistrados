import axios from 'axios';

export const getMovimientos = async () => {
    const res = await axios.get('https://172.16.5.213:3001/api/inventarios');
    return res.data;
};

export const createMovimiento = async (data) => {
    const res = await axios.post('https://172.16.5.213:3001/api/inventarios', data);
    return res.data;
};

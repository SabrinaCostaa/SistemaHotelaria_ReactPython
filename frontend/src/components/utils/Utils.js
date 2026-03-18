import axios from 'axios';

export const cpfMask = value => {    
    console.log('Dentro do CPF');
    return value
        .replace(/\D/g, '') // substitui qualquer caracter que nao seja numero por nada
        .replace(/(\d{3})(\d)/, '$1.$2') // captura 2 grupos de numero o primeiro de 3 e o segundo de 1, apos capturar o primeiro grupo ele adiciona um ponto antes do segundo grupo de numero
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d{1,2})/, '$1-$2')
        .replace(/(-\d{2})\d+?$/, '$1') // captura 2 numeros seguidos de um traço e não deixa ser digitado mais nada
}

export const cepMask = value => {    
    console.log('Dentro do CEP');
    return value
        .replace(/\D/g, '') // substitui qualquer caracter que nao seja numero por nada
        .replace(/(\d{5})(\d)/, '$1-$2')
}

// Configuração centralizada da API
const api = axios.create({
    baseURL: 'http://localhost:8080/api', // Aponta para o Gateway Nginx
    headers: {
        'Content-Type': 'application/json',
    }
});
export default api; 
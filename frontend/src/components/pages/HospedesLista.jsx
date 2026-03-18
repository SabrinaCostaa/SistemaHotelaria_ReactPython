import React from 'react'

export default function HospedesLista(props) {
    return (
        <>
          <table className="table">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">id</th>
                <th scope="col">Nome</th>
              </tr>
            </thead>
            <tbody>
              {props.data && props.data.map((hospede) => (
                  <tr key={hospede.id}> 
                    <td>
                      <input 
                        type="radio" 
                        name="rdHospede" 
                        onChange={() => props.handleSelecao(hospede.id)} 
                      />
                    </td>
                    <td>{hospede.id}</td>
                    <td>{hospede.nome}</td>
                    <td>{hospede.cpf}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </>
      );
}
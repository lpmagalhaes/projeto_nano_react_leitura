import React, { Component } from 'react';
import {Jumbotron, Button, Alert} from 'reactstrap';
import {converterTimestamp} from '../utils/helper';

class Postagem extends Component {
    render() {
        const {postagem, selecionarPostagem, removerPostagem} = this.props;
        let data = null;
        if(postagem){
            data = converterTimestamp(postagem.timestamp);
        }
        return (<div>
            {postagem ?
            <Jumbotron>                
                <h1 className="display-6">{postagem.title}</h1>
                <p className="lead">{postagem.body}</p>
                <hr className="my-2" />
                <p className="lead">{data} - Author: {postagem.author}</p>                
                {selecionarPostagem &&    
                    <p>
                        <Button onClick={() => selecionarPostagem(postagem)}>Detalhes da Postagem</Button>                         
                    </p>              
                }
                <p>
                    <Button>Comentários {postagem.commentCount}</Button>&nbsp;
                    <Button>#{postagem.category}</Button>     
                </p>
                <p>
                    Score: {postagem.voteScore}&nbsp;
                    <Button color='success'>Plus</Button>&nbsp;
                    <Button color='danger'>Minus</Button>         
                </p>
                {removerPostagem &&  
                    <p>        
                        <Button onClick={() => {removerPostagem()}} color='danger'>Remover Postagem</Button>         
                    </p>
                }
            </Jumbotron> : <Alert color="danger">Postagem Apagada</Alert>}        
        </div>);
    }

}

export default Postagem;

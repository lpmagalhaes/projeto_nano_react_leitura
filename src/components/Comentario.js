import React, { Component } from 'react';
import {Jumbotron, Button} from 'reactstrap';
import {converterTimestamp} from '../utils/helper';
import serializeForm from 'form-serialize';
import {inativarComentario, alterarComentario, 
    alterarPostagem, atualizarComentario} from '../actions';
import {connect} from 'react-redux';
import * as ReadableApi from '../utils/ReadableApi';

class Comentario extends Component {
    state = {
        divAlterarComentario: false,
        body: '',
    }  
    componentDidMount() {      
        this.props.comentarios.map(comentario => {
                if(comentario.id === this.props.id){
                    this.setState({body: comentario.body});
                }
        });       
    }
    mostrarDivParaAlterarComentario(){
        this.setState({divAlterarComentario: true});
    }
    atualizarCampoCorpo = (valor) => {
        this.setState({body: valor});
    }
    auxiliarDeSubmiti = (evento) => {
        evento.preventDefault();
        const valores = serializeForm(evento.target, {hash: true});      
        let comentario = null;
        const id = this.props.id;        
        this.props.comentarios.map(comentarioNaStore => {
            if(comentarioNaStore.id.toString() === id.toString()){
               comentario = comentarioNaStore;
            }
        });       
        comentario.body = valores.body;
        this.props.alterarComentario(comentario);
        this.esconderDivParaAlterarComentario();       
    }    
    esconderDivParaAlterarComentario(){
        this.setState({divAlterarComentario: false});
    } 
    removerComentario(comentario) {
        const {inativarComentario, alterarPostagem} = this.props;
        this.props.postagens.map(postagem => {
            if(postagem.id.toString() === comentario.parentId.toString()){
                postagem.commentCount--;
                inativarComentario(comentario)
                    .then(alterarPostagem(postagem)); 
            }
        });
    }   
    votar(valor, comentario) {
        if(valor === 'upVote'){
            comentario.voteScore++;
        }else{
            comentario.voteScore--;
        }
        
        ReadableApi.votar(comentario.id, 'comments', valor)
            .then(this.props.atualizarComentario(comentario));            
    }
    render() {
        let comentario = null;
        const id = this.props.id;        
        this.props.comentarios.map(comentarioNaStore => {
            if(comentarioNaStore.id.toString() === id.toString()){
               comentario = comentarioNaStore;
            }
        });
        const {divAlterarComentario, body} = this.state;
        let data = null;
        if(comentario){
            data = converterTimestamp(comentario.timestamp);
        }
        return (<div>
            {comentario && <Jumbotron>
                <h3>Comentário</h3>
                <p className="lead">{comentario.body}</p>
                <hr className="my-2" />
                <p className="lead">{data} - Author: {comentario.author}</p> 
                <p>
                    Score: {comentario.voteScore}&nbsp;
                    <Button color='success' onClick={() => {this.votar('upVote', comentario)}}>Plus</Button>&nbsp;
                    <Button color='danger' onClick={() => {this.votar('downVote', comentario)}}>Minus</Button>       
                </p> 
                <div>
                     <p>        
                         <Button onClick={() => this.removerComentario(comentario)} color='danger' >Remover</Button>         
                     </p>
                </div>
                
                <div>
                     <p>        
                         <Button onClick={() => this.mostrarDivParaAlterarComentario()}>Alterar</Button>         
                     </p>
                </div>    
                
                {divAlterarComentario &&
                    <div>
                        <form onSubmit={this.auxiliarDeSubmiti}>
                            <p>Alterar Comentario</p> 
                            <p>Corpo</p>
                            <p>
                                <input 
                                    value={body}
                                    type='text' 
                                    name='body'
                                    placeholder='Corpo'                            
                                    onChange={(event) => {
                                        this.atualizarCampoCorpo(event.target.value)
                                    }} 
                                />
                            </p>
                            <p><Button>Alterar</Button></p>
                        </form>
                    </div>    
                }
            </Jumbotron>}       
        </div>);
    }
}

function mapStateToProps({postagens, comentarios}) {
    return {postagens, comentarios};
}

function mapDispatchToProps(dispatch) {
    return {
        inativarComentario: (data) => dispatch(inativarComentario(data)),
        alterarComentario: (data) => dispatch(alterarComentario(data)),
        alterarPostagem: (data) => dispatch(alterarPostagem(data)),
        atualizarComentario: (data) => dispatch(atualizarComentario(data)),        
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Comentario);
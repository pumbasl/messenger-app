import { Component } from "react";
import { Container, Button } from "react-bootstrap";
import Input from '../components/input';

let lastMessageId = 0;

const customFetch = async (url, body) => {
    return await fetch(url, {
        method: 'POST', 
        headers: {
            accept: 'application/json',
            'content-type': 'application/json'
        },
        body: JSON.stringify(body)
    }).then(res => res.json());
};

export default class Chat extends Component{
    constructor(props){
        super(props);
        this.state = {
            history: false,
            isLoaded: false,
            idInterval: 0,
            value: ""
        };
        this.checkNewMessages = this.checkNewMessages.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(e){
        this.setState({
            value: e.target.value
        });
    }

    handleClick(e){
        e.preventDefault();
        if(this.state.value.trim() !== ''){
            customFetch("http://localhost:3005/api/addmessage", {
                data: {
                    text: this.state.value,
                    author: "Fino"
                }
            });
            clearInterval(this.state.idInterval);
            this.checkNewMessages(this.state.history);
            this.setState({
                idInterval: setInterval(() => {
                    this.checkNewMessages(this.state.history);
                }, 5000)
            });
            this.setState({
                value: ""
            });
        }
    }

    checkNewMessages(a){
        customFetch("http://localhost:3005/api/getmessages", {messageId: lastMessageId})
        .then(res => {
            if(res.data.length !== 0){
                console.log('Новое сообщение')
                for(const value of res.data){
                    console.log(value)
                    a.data.push(value);
                    ++lastMessageId;
                };
                this.setState({
                    history: a
                });
            } else {
                console.log('Новых сообщений нет')
                console.log(lastMessageId)
            }
        })
    }

    componentDidMount() {
        if(!this.state.isLoaded){
            customFetch("http://localhost:3005/api/getmessages")
            .then(res => {
                lastMessageId = res.data.length;
                this.setState({
                    history: res,
                    idInterval: setInterval(() => {
                        this.checkNewMessages(res);
                    }, 5000),
                    isLoaded: true
                });
            });
        }
    }  
    
    render(){
        if(this.state.history){
            return(
                <>
                    <Container fluid className="mt-2">
                        <Input type="text" onChange={(e) => {this.handleChange(e)}} value={this.state.value} placeholder="Ваше сообщение" />
                        <Button variant="secondary" className="ms-2" onClick={(e) => this.handleClick(e)}>Отправить</Button>
                    </Container>

                    <Container fluid>
                    {this.state.history.data.map(data => (
                        <div key={data.id}><b>{data.author}</b>: {data.text}</div>
                    ))}
                    </Container>
                </>
            );
        } else {
            return(
                <>
                    <Container fluid className="mt-2">
                        <Input type="text" onChange={(e) => {this.handleChange(e)}} value={this.state.value} placeholder="Ваше сообщение" />
                        <Button variant="secondary" className="ms-2" onClick={(e) => this.handleClick(e)}>Отправить</Button>
                    </Container>
                    <div>Загрузка...</div>
                </>
            );
        }
    }
}
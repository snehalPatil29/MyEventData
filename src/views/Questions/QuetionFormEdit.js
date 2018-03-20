import React, { Component } from 'react';
import {
    Badge, Row, Col, Card, Dropdown, Form, DropdownToggle, FormInput,
    InputGroup, Input, FormGroup, Label, CardHeader, CardBody, Container,
    Table, Pagination, DropdownMenu, PaginationItem, PaginationLink, InputGroupAddon, InputGroupText, Button
} from 'reactstrap';
import Select from 'react-select';
import * as firebase from 'firebase';
import 'firebase/firestore';
import { DBUtil } from '../../services';

let QueArray=[];

class QuetionFormEdit extends Component {
    constructor() {
        super();
        this.state = {
            Forms: [],  //stores all available forms
            FormID: [],   //form name( doc name in firestore)
            formValue: '',     //name of the current form 
            CurrentForm: [],    //Current form questions data
            QueAns : []        ///Question and Answer data after  filling form
          }
          this.onSelectForm = this.onSelectForm.bind(this);
          this.onFormSelectValue = this.onFormSelectValue.bind(this);  //start rendering questions 
          this.RenderAnswerField = this.RenderAnswerField.bind(this);  //start rendering answer 
         // this.onMultiChoice = this.onMultiChoice.bind(this);   //If input field is multiple choice (rendering multiple choice)
          //this.onCheckBox = this.onCheckBox.bind(this);  //If input field is Check Box (rendering  Check Box)
          //this.onChange = this.onChange.bind(this);    //on change of the input fields
         // this.onSubmit = this.onSubmit.bind(this);     //On submit of form
         this.onChangeInputField = this.onChangeInputField.bind(this);
    }

    componentWillMount() {
        let componentRef = this;
        DBUtil.addChangeListener("Que", function (objectList) {
          let form = [];
          let FormID = [];
          objectList.forEach(function (doc) {
            FormID.push({ label: doc.id, value: doc.id });
            form.push({
              FormID: doc.id,
              FormData: doc.data()
            });
          });
          componentRef.setState({ Forms: form, FormID: FormID })
        });
      }

      onSelectForm(formValue) {
        let CurrentForm = [];
        this.state.Forms.forEach(fItem => {
          if (fItem.FormID == formValue) {
            CurrentForm = (fItem.FormData.Questions);
          }
        })
        this.setState({ formValue: formValue, CurrentForm: CurrentForm });
      }
    
      onFormSelectValue() {
        let ShareInput = this.state.CurrentForm.map(Fitem => {
          QueArray.push({Question : Fitem.QuestionTitle , Answer: new Set()});
          return (
            <div>
                <Row>
                <Col xs="12" md="12">
              <p className="text-muted"><h5>Question No: {Fitem.QueId}</h5></p>
              </Col>
              </Row>
              <FormGroup row>
              
                <Col xs="12" md="8">
                  <InputGroup className="mb-3" >
                    <InputGroupAddon addonType="prepend">
                      <InputGroupText>
                        <i className="icon-question"></i>
                      </InputGroupText>
                    </InputGroupAddon>
                    <Input type="text"  id={Fitem.QueId} defaultValue={Fitem.QuestionTitle} onChange={this.onChange}/>
                  </InputGroup>
                  {/* <p className="text-muted"><h5><i className="icon-bullseye"></i> {Fitem.QuestionTitle}</h5></p> */}
                  {this.RenderAnswerField(Fitem)}
                </Col>
                <Col  md="4">
                <FormGroup row>
                <h5> <Badge color="danger"  pill>Delete Question no {Fitem.QueId} </Badge></h5>
                </FormGroup >
                <FormGroup row>
                <Col md="6">
                <InputGroup className="mb-3">
                  <Input type="select"  name="InputField" id={Fitem.QueId} placeholder="Feilds" onChange={(event) => this.onChangeInputField(event,Fitem.QueId)} >
                  <option value=" ">--Select--</option>
                    <option value="Input Text">Input Text</option>
                    <option value="Mulitple Choice">Mulitple Choice</option>
                    <option value="Check Box">Check Box</option>
                  </Input>
                </InputGroup>
                </Col>
                    </FormGroup >
                </Col>
              </FormGroup>
            </div>
          )
        });
        return ShareInput;
      }
    
    
      RenderAnswerField(item) {
        if (item.AnswerFeild == "Input Text") {
          return (
            <div>
              <FormGroup row>
                <Col xs="12" md="6" >
                  <InputGroup className="mb-3" >
                    <InputGroupAddon addonType="prepend">
                      <InputGroupText>
                        <i className="icon-note"></i>
                      </InputGroupText>
                    </InputGroupAddon>
                    <Input type="text" placeholder="Answer Title" name="Answer" id={item.QueId} onChange={this.onChange}/>
                  </InputGroup>
                </Col>
              </FormGroup>
            </div>
          )
    
        } else if (item.AnswerFeild == "Mulitple Choice") {
          return (
            <div>
              <FormGroup row>
                <Col  >
                  {this.onMultiChoice(item.value , item.QueId)}
                </Col>
              </FormGroup>
            </div>
          )
        }
        else if (item.AnswerFeild == "Check Box") {
          return (
            <div>
              <FormGroup row>
                <Col md="12" xs="12" >
                  {this.onCheckBox(item.value , item.QueId)}
                </Col>
              </FormGroup>
            </div>
          )
        }
        return (
          <div />
        )
      }
    
      onMultiChoice(value , id) {
          let MultiChoice = value.map(fItem => {
              return (
                <FormGroup check inline>
                  <Input className="form-check-input" id={id} type="radio" name="inline-radios" value={fItem.Value} />
                  <Input id={id} type="text" defaultValue={fItem.Value} />
                  {/* <Label className="form-check-label" id={id} check htmlFor="inline-radio1">{fItem.Value}</Label> */}
                </FormGroup>
              )
          })
          if(MultiChoice.length == 0){
            MultiChoice : return(
              <div>
              <FormGroup row>
                <Col xs="12">
                  <FormGroup check inline>
                    <Input className="form-check-input" type="radio" id={id} name="inline-radios" value="option1" />
                    <Input type="text" placeholder="Add Choice" id={id} name = "0"  />
                  </FormGroup>
                  <FormGroup check inline>
                    <Input className="form-check-input" type="radio" id={id} name="inline-radios" value="option2" />
                    <Input type="text" placeholder="Add Choice" id={id} name="1"    />
                  </FormGroup>
                  <FormGroup check inline>
                    <Input className="form-check-input" type="radio" id={id} name="inline-radios" value="option3" />
                    <Input type="text" placeholder="Add Choice" id={id} name="2"    />
                  </FormGroup>
                  <FormGroup check inline>
                    <Input className="form-check-input" type="radio" id={id} name="inline-radios" value="option3" />
                    <Input type="text" placeholder="Add Choice" id={id} name="3"    />
                  </FormGroup>
                  <FormGroup check inline>
                    <Input className="form-check-input" type="radio" id={id} name="inline-radios" value="option3" />
                    <Input type="text" placeholder="Add Choice" id={id} name="4"   />
                  </FormGroup>
                </Col>
              </FormGroup> 
              </div>
            )
          }
          return MultiChoice;
      
      }
    
    
      onCheckBox(value ,id) {
        let CheckBox = value.map(fItem => {
          return (
            <FormGroup check inline>
              <Label >
                <Input type="checkbox" id={id} />
                <Input id={id} type="text" defaultValue={fItem.Value} />
              </Label>
            </FormGroup>
    
          )
        })
        if(CheckBox.length == 0){
         CheckBox : return(
          <div>  <div> 
          <FormGroup row>
            <Col xs="12">
              <FormGroup check inline>
                <Label check>
                  <Input type="checkbox" id={id} />
                </Label>
                <Input type="text" placeholder="Add value" id={id} name="0"   />
              </FormGroup>

              <FormGroup check inline>
                <Label check>
                  <Input type="checkbox" id={id} />
                </Label>
                <Input type="text" placeholder="Add value" id={id} name="1"  />
              </FormGroup>

              <FormGroup check inline>
                <Label check>
                  <Input type="checkbox" id={id} />
                </Label>
                <Input type="text" placeholder="Add value" id={id} name="2"  />
              </FormGroup>

              <FormGroup check inline>
                <Label check>
                  <Input type="checkbox" id={id} />
                </Label>
                <Input type="text" placeholder="Add value" id={id} name="3"  />
              </FormGroup>

              <FormGroup check inline>
                <Label check>
                  <Input type="checkbox" id={id} />
                </Label>
                <Input type="text" placeholder="Add value" id={id} name="4"  />
              </FormGroup>
            </Col>
          </FormGroup>
        </div></div>
         );
        }
        
          return CheckBox;
       
       
      }
    onChangeInputField(event,id){
      let tempArray = this.state.CurrentForm;
      tempArray[id].AnswerFeild = event.target.value;
      tempArray[id].value = [];
this.setState({CurrentForm : tempArray});
      console.log('id',this.state.CurrentForm);
    }
    //   onChange(event){
    //     let id = parseInt(event.target.id);
    //     let label  = event.target.value;
    //     if(event.target.type == "checkbox"){
    //       if (QueArray[id].Answer.has(label)) {
    //         QueArray[id].Answer.delete(label);
    //       } else {
    //         QueArray[id].Answer.add(label);
    //       }
    //     }
    //     else{
    //       QueArray[id].Answer = event.target.value;
    //     }
            
    //   }
    
      onSubmit(){
        QueArray.forEach(fItem => {
          if(fItem.Answer.size >= 1)
          fItem.Answer = Array.from(fItem.Answer);
        })
        this.setState({QueAns : QueArray});
        let componentRef = this;
        let tableName = "QuetionandAnswerArray";
        let docName = "aRRAY1";
        let doc = {
          Set : QueArray
        }
        DBUtil.addDoc(tableName, docName, doc, function () {          //add doc to firebase
          console.log('added');
          componentRef.props.history.push('/dashboard');
        },
          function (err) {
            console.log('Error', err);
          });
      }
      render() {
        const { Form, formValue } = this.state;
        const options = this.state.FormID;
        console.log('forms', this.state);
        if (formValue == '') {
          return (
            <div>
              <FormGroup>
                <FormGroup>
                  <Select
                    multi
                    onChange={this.onSelectForm}
                    placeholder="Select Form"
                    simpleValue
                    value={formValue}
                    options={options}
                  />
                </FormGroup>
              </FormGroup>
            </div>
          );
        }
        else {
          return (
            <div className="animated fadeIn">
              <Container>
                <Row className="justify-content-center">
                  <Col md="12">
                    <Card className="mx-12">
                      <CardBody className="p-6">
                      <Col xs="12" md="6">
                        <h1>{this.state.formValue}</h1>
                        </Col>
                        <Col  md="6">
                        <h4> <Badge color="primary" pill> <i className="icon-note"></i> Add Question</Badge></h4>
                        </Col>
                        <FormGroup row>
                          <Col xs="12" >
                            {this.onFormSelectValue()}
                          </Col>
                        </FormGroup>
                        <FormGroup row>
                        <Col xs="2" md="1" >
                          <Button type="submit" size="md" color="primary" onClick={this.onSubmit}  >Submit</Button>
                        </Col>
                        <Col md="1">
                          <Button  type="reset" size="md" color="danger" ><i className="fa fa-ban"></i> Reset</Button>
                        </Col>
                      </FormGroup>
                      </CardBody>
                    </Card>
                  </Col>
                </Row>
              </Container>
            </div>
          )
    
        }
      }
    }
export default QuetionFormEdit;


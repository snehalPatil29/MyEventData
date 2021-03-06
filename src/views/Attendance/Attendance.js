import React, {Component} from 'react';
import { Row, Col, Card, CardBody, Table } from 'reactstrap';
import * as firebase from 'firebase';
import 'firebase/firestore';
import { DBUtil } from '../../services';
import { IntlProvider, FormattedDate ,FormattedTime } from 'react-intl';

class Attendance extends React.Component {
    constructor() {
        super();
        this.state = {
            items: []
        }
    }

    // Method for get attendance data
    componentWillMount() {
        let componentRef = this;
        DBUtil.addChangeListener("Attendance", function (objectList) {
            let Users = [];
            let UsersID = [];
            objectList.forEach(function (doc) {
                UsersID.push(doc.id);
                Users.push({
                    UserID: doc.id,
                    UserData: doc.data()
                });
            });
            componentRef.setState({items: Users, itemsID: UsersID})
        });
    }

    render() {
        this.rows = this.state.items.map(function (row) {
            return <tr key={row.UserID} >
                <td>{row.UserData.firstName + " " + row.UserData.lastName}</td>
                <td>{row.UserData.email}</td>
                <td>{row.UserData.contactNo}</td>
                <td><FormattedDate value={row.UserData.timesteamp.toString()} /></td>{/*<FormattedTime value={row.UserData.timesteamp.toString()} />  */}
                <td>{row.UserData.registrationType}</td>
            </tr>
            });

        return (
            <div className="animated fadeIn">
                <IntlProvider locale="en">
                    <Row>
                        <Col md="12" >
                            <Card>
                                <CardBody className="p-4">
                                <h1>Attendance List</h1>
                                    <Table responsive>
                                        <thead>
                                            <tr>
                                                <th>Name</th>
                                                <th>Email</th>
                                                <th>Contact No</th>
                                                <th>Date</th>
                                                <th>Registration type </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {this.rows}
                                        </tbody>
                                    </Table>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                </IntlProvider>             
            </div>
        )
    }
}
export default Attendance;

import React from 'react';
import Modal from 'react-modal';

const customStyles = {
  content : {
    top                   : '50%',
    left                  : '50%',
    right                 : 'auto',
    bottom                : 'auto',
    marginRight           : '-50%',
    transform             : 'translate(-50%, -50%)'
  }
};

export default class Test extends React.Component {
  constructor() {
    super();

    this.state = {
      modalIsOpen: false
    };

    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
  }

  openModal() {
    this.setState({modalIsOpen: true});
  }

  closeModal() {
    this.setState({modalIsOpen: false});
  }

  render() {
    return (
      <div>
        <button onClick={this.openModal}>Open Modal</button>
        <Modal
          isOpen={this.state.modalIsOpen}
          onAfterOpen={this.afterOpenModal}
          onRequestClose={this.closeModal}
          style={customStyles}
          contentLabel="Example Modal"
        >

          {/* <h2 ref={subtitle => this.subtitle = subtitle}>Hello</h2> */}
          <button onClick={this.closeModal}>X</button>
          {/* <div>I am a modal</div> */}
          <form id="form_advanced_validation" method="POST" onSubmit={this.handleSubmit}>
        <h2 className="card-inside-title">
          Please enter your emergency contact details
        </h2>
        <div className="row clearfix">
          <div className="col-sm-3">
            <div className="form-group">
              <div className="form-line">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Name"
                  ref='name'
                />
              </div>
            </div>
          </div>
          <div className="col-sm-3">
            <div className="form-group">
              <div className="form-line">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Relation"
                  ref='relation'
                />
              </div>
            </div>
          </div>
          <div className="col-sm-3">
            <div className="form-group">
              <div className="form-line">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Occupation"
                  ref='occupation'
                />
              </div>
            </div>
          </div>
          <div className="col-sm-3">
            <div className="form-group">
              <div className="form-line">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Contact Number"
                  ref='contactnumber'
                />
              </div>
            </div>
          </div>
        </div>
        <button className="btn btn-primary waves-effect" type="submit">
          SUBMIT
        </button>
      </form>
        </Modal>
      </div>
    );
  }
}
import React, { Component } from 'react';
import { Contact } from 'blockstack-collection-schemas'
import { InputGroup, Input } from './components/Input'
import { Link, withRouter } from 'react-router-dom'
import qs from 'qs'

class EditContact extends Component {

  constructor(props) {
  	super(props);

  	this.state = {
      new: props.new,
      contact: Contact,
      identifier: "",
      lastName: "",
      firstName: "",
      blockstackID: "",
      email: "",
      website: "",
      telephone: "",
      errors: {},
      saving: false,
      loading: false,
      deleting: false
  	};
  }

  componentDidMount() {
    if (!this.props.new) {
      let queryParams = qs.parse(this.props.location.search, { ignoreQueryPrefix: true })
      let identifier = queryParams.id
      if (identifier) {
        this.fetchContact(identifier)
      } else {
        this.setState({
          errors: { notFound: 'The contact does not exist.' }
        })
      }
    }
  }

  fetchContact = (identifier) => {
    this.setState({
      loading: true
    })
    Contact.get(identifier).then(contact => {
      if (contact) {
        this.setState({
          contact: contact,
          identifier: contact.identifier,
          lastName: contact.lastName || "",
          firstName: contact.firstName || "",
          blockstackID: contact.blockstackID || "",
          email: contact.email || "",
          website: contact.website || "",
          telephone: contact.telephone || "",
          loading: false
        })
      } else {
        this.setState({
          loading: false,
          errors: { notFound: 'Error fetching contact data.' }
        })
      }
    })
    .catch(error => {
      this.setState({
        loading: false,
        errors: { notFound: 'Error fetching contact data.' }
      })
    })
  }

  onChange(e, field) {
    e.preventDefault()
    if (e.target.value.length < 50) {
      this.setState({
        [field]: e.target.value
      })
    }
  }

  validateInput = () => {
    let errors = {}
    if (this.state.firstName === '') {
      errors.firstName = 'Please enter a name.'
    }
    if (this.state.lastName === '') {
      errors.lastName = 'Please enter a name.'
    }

    return errors
  }

  checkExisting = (identifier) => {
    return Contact.get(identifier)
      .then((contact) => {
        if (contact) {
          return true
        } else {
          return false
        }
      })
      .catch(() => {
        return false
      })
  }

  handleSave = () => {
    if (!this.state.saving) {
      let errors = this.validateInput()
      if (Object.entries(errors).length) {
        this.setState({
          errors
        })
        return
      }

      this.setState({
        saving: true
      })

      if (this.state.new) {
        return this.checkExisting(this.state.contact.identifier)
        .then((contactExists) => {
          if (contactExists) {
            this.setState({
              errors: {contactExists: `Contact "${this.state.name}" already exists, cannot overwrite.`},
              saving: false
            })
          } else {
            return this.createNewContact()
          }
        })
      } else {
        return this.saveContact()
      }
    }
  }

  createNewContact = () => {
    const newContact = {
      lastName: this.state.lastName,
      firstName: this.state.firstName,
      blockstackID: this.state.blockstackID,
      email: this.state.email,
      website: this.state.website,
      telephone: this.state.telephone
    }

    var contact = new Contact(newContact)
    contact.save()
      .then(() => {
        this.props.history.push('/')
      })
  }

  saveContact = () => {
    if (this.state.contact) {
      let newContact = this.state.contact
      newContact.lastName = this.state.lastName
      newContact.firstName = this.state.firstName
      newContact.blockstackID = this.state.blockstackID
      newContact.email = this.state.email
      newContact.website = this.state.website
      newContact.telephone = this.state.telephone
      this.setState({
        contact: newContact
      })
      newContact.save().then(() => {
        this.props.history.push('/')
      })
    }
  }

  handleDelete = () => {
    if (!this.state.deleting) {
      this.setState({
        deleting: true
      })
      if (this.state.contact) {
        this.state.contact.delete().then(() => {
          this.props.history.push('/')
        })
      }
    }
  }

  render() {
    return (
      <div className="panel-landing" id="section-1">
        <h1 className="landing-heading">{this.state.new ? 'New Contact' : 'Edit Contact'}</h1>
        { this.state.errors.notFound && this.state.errors.notFound }
        { this.state.loading && 'Loading...'}
        { !this.state.loading && !this.state.errors.notFound && 
          <div className="panel">
            <InputGroup>
              First Name <br/>
              <span className="input-error">{this.state.errors.firstName}</span>
              <Input 
                type="text" 
                value={this.state.firstName} 
                onChange={e => this.onChange(e, 'firstName')}
              />
            </InputGroup>
            <InputGroup>
              Last Name <br/>
              <span className="input-error">{this.state.errors.lastName}</span>
              <Input 
                type="text" 
                value={this.state.lastName} 
                onChange={e => this.onChange(e, 'lastName')}
              />
            </InputGroup>
            <InputGroup>
              Blockstack ID <br/>
              <Input 
                type="text" 
                value={this.state.blockstackID} 
                onChange={e => this.onChange(e, 'blockstackID')}
              />
            </InputGroup>
            <InputGroup>
              Email <br/>
              <Input 
                type="text" 
                value={this.state.email} 
                onChange={e => this.onChange(e, 'email')}
              />
            </InputGroup>
            <InputGroup>
              Website <br/>
              <Input 
                type="text" 
                value={this.state.website} 
                onChange={e => this.onChange(e, 'website')}
              />
            </InputGroup>
            <InputGroup>
              Telephone <br/>
              <Input 
                type="text" 
                value={this.state.telephone} 
                onChange={e => this.onChange(e, 'telephone')}
              />
            </InputGroup>
            <br/>
            { this.state.errors.contactExists && 
              <span className="input-error">{this.state.errors.contactExists}<br/><br/></span> }
              <div className="button-group">
                <button
                  className="btn btn-primary btn-lg"
                  id="save-button"
                  disabled={this.state.saving}
                  onClick={this.handleSave}
                >
                  {this.state.saving ? 'Saving' : 'Save' }
                </button>
                <button
                  className="btn btn-danger btn-lg"
                  id="delete-button"
                  disabled={this.state.deleting}
                  onClick={this.handleDelete}
                >
                  {this.state.deleting ? 'Deleting' : 'Delete' }
                </button>
              </div>
            <Link
              className="btn btn-default btn-lg"
              to="/"
            >
              Back
            </Link>
          </div>
        }
      </div>
    );
  }
}

export default withRouter(EditContact)
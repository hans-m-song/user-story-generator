import React, { Component } from 'react';
import './App.scss';

class UserStory extends Component {
  state = {
    editable: false,
    id: this.props.id,
    points: this.props.points,
    role: this.props.role,
    purpose: this.props.purpose,
    reason: this.props.reason,
    acceptanceCriteria: this.props.acceptanceCriteria,
    notes: this.props.notes,
  };

  toggleEdit = (e) => {
    e.preventDefault();
    this.setState({ editable: !this.state.editable });
  }

  handleInputChange = (e) => {
    e.preventDefault();
    this.setState({ [e.target.name]: e.target.value })
  }

  render() {
    return (
      <div className={`UserStory ${(this.state.editable) ? 'editable' : ''}`}>
      
        <div className='meta'>

          <label>Story id: 
            <input 
              name='id' 
              type='text' 
              disabled={true}
              value={this.state.id}>
            </input>
          </label>

          <label>Story points:
            <input 
              name='points' 
              type='text'
              disabled={!this.state.editable}
              onChange={this.handleInputChange}
              value={this.state.points}>
            </input>
          </label>

        </div>

        <label>As a:
            <input 
              name='role' 
              type='text'
              disabled={!this.state.editable}
              onChange={this.handleInputChange}
              value={this.state.role}>
            </input>
          </label>

        <p>I want:</p>
        <textarea
          name='purpose' 
          disabled={!this.state.editable}
          onChange={this.handleInputChange}
          value={this.state.purpose}>
        </textarea>

        <p>So that:</p>
        <textarea
          name='reason' 
          disabled={!this.state.editable}
          onChange={this.handleInputChange}
          value={this.state.reason}>
        </textarea>

        <p>Acceptance criteria</p>
        <textarea
          name='acceptanceCriteria' 
          disabled={!this.state.editable}
          onChange={this.handleInputChange}
          value={this.state.acceptanceCriteria}>
        </textarea>

        <p>Notes</p>
        <textarea
          name='notes' 
          disabled={!this.state.editable}
          onChange={this.handleInputChange}
          value={this.state.notes}>
        </textarea>

        <button
          className='edit' 
          onClick={this.toggleEdit}>
            {(this.state.editable) ? 'Save' : 'Edit'}
        </button>

      </div>
    )
  }
}

class App extends Component {
  state = {
    stories: [],
    roles: [],
    newRole: '',
    role: '',
    id: '',
    points: '',
    purpose: '',
    reason: '',
    acceptanceCriteria: '',
    notes: '',
    import : '',
    showRaw: false,
  };

  handleImport = (e) => {
    e.preventDefault();

    let imported;
    try {
      imported = JSON.parse(this.state.import);
    } catch (err) {
      alert(err);
    }

    if (imported.roles && Object.values(imported.roles).length > 0) {
      this.setState({ roles: imported.roles });
    }

    if(imported.stories && Object.values(imported.stories).length > 0) {
      const newStories = [];
      imported.stories.forEach((story) => {
        if (story.id && 
            story.points && 
            story.role &&
            story.purpose &&
            story.reason)
          newStories.push(story);
      });

      this.setState({ stories: newStories });
    }
  }

  deleteUserStory = (e, id) => {
    e.preventDefault();
    this.setState({
      stories: [ ...this.state.stories.filter(e => e.id !== id) ]
    })
  }

  generateUserStories = () => {
    const list = [];
    for (const story of this.state.stories) {
      list.push(
        <div className='user-story-container' key={story.id}>
          <UserStory
            {...story}
          />
          <button 
            className='edit' 
            onClick={(e) => this.deleteUserStory(e, story.id)}>
              Delete
          </button>
        </div>
      );
    }

    return list;
  }

  deleteUserRole = (e, role) => {
    e.preventDefault();
    
    this.setState({
      roles: [ ...this.state.roles.filter(e => e !== role) ]
    })
  }

  generateUserRoles = () => {
    const list = [];
    for (const role of this.state.roles) {
      list.push(
        <div className='UserRole' key={role}>

          <p>{role}</p>
          {/* <button>Edit</button> */}
          <button onClick={(e) => this.deleteUserRole(e, role)}>Delete</button>
        
        </div>
      );
    }

    return list;
  }

  handleInputChange = (e) => {
    e.preventDefault();
    this.setState({ [e.target.name]: e.target.value })
  }

  handleUserRoleSubmit = (e) => {
    e.preventDefault();

    if (this.state.newRole !== '' && this.state.roles.indexOf(this.state.newRole) < 0) {
      if (this.state.role === '') {
        this.setState({
          role: this.state.newRole,
        });
      }

      this.setState({
        roles: [ ...this.state.roles, this.state.newRole ],
        newRole: '',
      });
    }
  }

  handleUserStorySubmit = (e) => {
    e.preventDefault();

    const id = (this.state.id === '') ? Math.floor(Math.random() * 10000) : this.state.id;
    if (this.state.points   !== '' && 
        this.state.role     !== '' && 
        this.state.purpose  !== '' && 
        this.state.reason   !== '' && 
        this.state.stories.find(e => e.id === id) === undefined) {
      console.log('test');
      this.setState({
        stories: [ ...this.state.stories, {
          id,
          role: this.state.role,
          points: this.state.points,
          purpose: this.state.purpose,
          reason: this.state.reason,
          acceptanceCriteria: this.state.acceptanceCriteria,
          notes: this.state.notes,
        } ],
      });

      this.setState({
        id: '',
        points: '',
        purpose: '',
        reason: '',
        acceptanceCriteria: '',
        notes: '',
      });
    } else {
      alert(`missing fields:
          ${(this.state.points === '') ? 'points' : ''}
          ${(this.state.role === '') ? 'role' : ''}
          ${(this.state.purpose === '') ? 'purpose' : ''}
          ${(this.state.reason === '') ? 'reason' : ''}
          `)
    }

  }

  render() {
    return (
      <div className="App">

        <div className='import-export'>
          <h3>Import</h3>
          
          <form className='import-form' onSubmit={this.handleImport}>
          
            <input
              name='import'
              type='text'
              onChange={this.handleInputChange}
              value={this.state.import}>
            </input>
            <input type='submit'></input>

          </form>

          <h3>Export</h3>

          <button 
            disabled={this.state.stories.length < 1 && this.state.roles.length < 1}
            onClick={() => this.setState({ showRaw: !this.state.showRaw })}>
            {(this.state.showRaw) ? 'hide raw' : 'show raw'}
          </button>

          <button 
            disabled={this.state.stories.length < 1 && this.state.roles.length < 1}
            onClick={() => this.setState({ showFormatted: !this.state.showFormatted })}>
            {(this.state.showFormatted) ? 'hide formatted' : 'show formatted'}
          </button>

          {(() => {
            if (this.state.showRaw && (this.state.stories.length > 0 || this.state.roles.length > 0))
              return (
                  <pre>{JSON.stringify({roles: this.state.roles, stories: this.state.stories}, null, 4)}</pre>
              );
          })()}

          {(() => {
            if (this.state.showFormatted && (this.state.stories.length > 0 || this.state.roles.length > 0))
              return (
                  <div>
                    <p><strong>roles:</strong> <br />{this.state.roles.toString()}</p>
                    <p><strong>stories:</strong> </p>
                    {this.state.stories.map(story => {
                      return (
                        <p>
                          <ins>As a</ins> {story.role} <br />
                          <ins>I want</ins> {story.purpose} <br />
                          <ins>So that</ins> {story.reason}<br />
                        </p>
                      );
                    })}
                  </div>
              );
          })()}

        </div>

        <div className='roles'>

          <h3>Roles</h3>

          <form className='new-user-role' onSubmit={this.handleUserRoleSubmit}>

            <label>User role:
              <input
                name='newRole'
                type='text'
                onChange={this.handleInputChange}
                value={this.state.newRole}></input></label>
            <input type='submit'></input>
          
          </form>

          <div className='user-roles-list'>{this.generateUserRoles()}</div>

        </div>
        
        <div className='new-user-story'>

          <form className='user-story-form' onSubmit={this.handleUserStorySubmit}>

            <h3>New user story</h3>

            <div className='meta'>
            
              <label>Story id: 
                <input 
                  name='id' 
                  type='text'
                  className='short'
                  onChange={this.handleInputChange}
                  value={this.state.id}>
                </input>
              </label>

              <label>Story points: 
                <input
                  name='points' 
                  type='text'
                  className='short'
                  onChange={this.handleInputChange}
                  value={this.state.points}>
                </input>
              </label>

            </div>

            <label>As a: 
                <select
                  name='role' 
                  className='short'
                  onChange={this.handleInputChange}
                  value={this.state.role}>
                  {(() => this.state.roles.map(role => <option key={role} value={role}>{role}</option>))()}
                </select>
              </label>

            <p>I want:</p>
            <textarea
              name='purpose' 
              onChange={this.handleInputChange}
              value={this.state.purpose}>
            </textarea>

            <p>So that:</p>
            <textarea
              name='reason' 
              onChange={this.handleInputChange}
              value={this.state.reason}>
            </textarea>

            <p>Acceptance criteria</p>
            <textarea
              name='acceptanceCriteria' 
              onChange={this.handleInputChange}
              value={this.state.acceptanceCriteria}>
            </textarea>

            <p>Notes</p>
            <textarea
              name='notes' 
              onChange={this.handleInputChange}
              value={this.state.notes}>
            </textarea>
            

            <input className='' type='submit'></input>

          </form>

        </div>

        <div className='display-area'>
        
          <h3>User stories</h3>

          <div className='user-story-list'>
            {this.generateUserStories()}
          </div>
          
        </div>

      </div>
    );
  }
}

export default App;

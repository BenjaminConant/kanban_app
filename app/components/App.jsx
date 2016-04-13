import AltContainer from 'alt-container';
import React from 'react';
// import Notes from './Notes.jsx';
// import NoteActions from '../actions/NoteActions';
// import NoteStore from '../stores/NoteStore';
// <Notes
//   onEdit={this.editNote}
//   onDelete={this.deleteNote}
// />
import Lanes from './Lanes.jsx';
import LaneActions from '../actions/LaneActions';
import LaneStore from '../stores/LaneStore';
import {DragDropContext} from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';

@DragDropContext(HTML5Backend)




export default class App extends React.Component {

  render() {

    return (
      <div>
        <button className="add-note" onClick={this.addLane}>+</button>
        <AltContainer
          stores={[LaneStore]}
          inject={{
            lanes: () => LaneStore.getState().lanes || []
          }}>
          <Lanes />

        </AltContainer>

      </div>
    )
  }

  // addNote = () => {
  //   NoteActions.create({task: 'New Task'});
  // };
  //
  // editNote = (id, task) => {
  //   // Don't modify if trying to set an empty value
  //   if (!task.trim()) {
  //     return;
  //   }
  //
  //   NoteActions.update({id, task});
  // };
  //
  // deleteNote = (id, e) => {
  //   // avoid bubbling to edit
  //   e.stopPropagation();
  //   NoteActions.delete(id);
  // };

  addLane () {
    LaneActions.create({name: 'New Lane'});
  }
}
import React from 'react';

export default class Editable extends React.Component {

  render () {
    const {value, onEdit, onValueClick, editing, ...props} = this.props;
    return (
      <div {...props}>
        {editing ? this.renderEdit() : this.renderValue()}
      </div>
    )
  }

  renderEdit = () => {
    // We deal with blur and input handlers here. These map to DOM events.
    // We also set selection to input end using a callback at a ref.
    // It gets triggered after the component is mounted
    // We could also use a string refrence (i.e `ref="input"`) and then
    // refer to the element in a question later in the code. This would
    // allow us to use the underlying DOM API through
    // this.refs.input. This can be usefll when combined with
    // React lifecycle hooks
    return <input type="text"
      ref = {
        (e) => e ? e.selectionStart = this.props.value.length : null
      }
      autoFocus={true}
      defaultValue={this.props.value}
      onBlur={this.finishEdit}
      onKeyPress={this.checkEnter} />

  };

  renderValue = () => {
    const onDelete = this.props.onDelete;

    return (
      <div onClick={this.props.onValueClick}>
        <span className="value">{this.props.value}</span>
        {onDelete ? this.renderDelete() : null }
      </div>
    );
  };

  renderDelete = () => {
    return <button
      className="delete"
      onClick={this.props.onDelete}>x</button>;
  };

  checkEnter = (e) => {
    // the user hit *enter*, lets finish up
    if (e.key === 'Enter') {
      this.finishEdit(e);
    }
  };

  finishEdit = (e) => {

    const value = e.target.value;
    if (this.props.onEdit) {
      this.props.onEdit(value);
    }
  }

}
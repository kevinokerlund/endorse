import React, {Component, Fragment} from 'react';
import './App.css';

class Endorsable extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		return this.props.children;
	}
}

class App extends Component {
	constructor(props) {
		super(props);
		this.state = {
			value: '',
		};
	}

	change = (e) => {
		this.setState({value: e.target.value});
	};

	render() {
		return (
			<Fragment>
				<div className="Stuff">
					<form>
						<label htmlFor="number">Number:</label>
						<Endorsable rules="number">
							<input type="text" id="number" value={this.state.value} onChange={this.change}/>
						</Endorsable>

						<br/><br/>

						<button type="button" onClick={this.validate}>Validate Stuff</button>
					</form>
				</div>
			</Fragment>
		);
	}
}

export default App;

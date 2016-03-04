import React, {
	View,
	Text,
	TouchableOpacity,
	Dimensions,
} from 'react-native';
import Animatable from 'react-native-animatable';
const { width, height } = Dimensions.get('window');

class Number extends React.Component {
	render() {
		const { children, pushIn } = this.props;
		const value = children;
		return (
			<TouchableOpacity 
				onPress={() => pushIn(value)} 
				style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFFFFF', height: 50 }}>
				<Text style={{ fontSize: 30 }}>{value}</Text>
			</TouchableOpacity>
		)
	}
}

class Signal extends React.Component {
	render () {
		const { children, popOut } = this.props;
		return (
			<TouchableOpacity 
				onPress={popOut} 
				style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#D1D5DA', height: 50 }}>
				<Text style={{ fontSize: 18 }}>{children}</Text>
			</TouchableOpacity>
		)	
	}
}

class NumberPad extends React.Component {
	constructor(props){
		super(props);
		this.state = {
			stack: [],
			isVisible: true,
			dot_allowed: true,
		}
	}
	componentDidMount() {
		//this.view.bounceInUp(600);
	}
	async componentWillReceiveProps(nextProps) {
		if(this.state.isVisible === nextProps.isVisible) {
			return ;
		}else if(nextProps.isVisible === true) {
			this.setState({ isVisible: nextProps.isVisible });
			await this.view.bounceInUp(600);
		}else if(nextProps.isVisible === false) {
			this.setState({ isVisible: nextProps.isVisible });
			await this.view.fadeOutDown(200);
		}
	}
	_pushIn(value) {
		if(this.state.stack.length > 12) {
			return ;
		}
		if(this.state.stack[this.state.stack.length-3] === '.') {
			return ;
		}
		if(this.state.stack.length === 0 && (value == 0 || value === '.')) {
			return ;
		}
		if(value === '.' && this.state.dot_allowed === false) {
			return ;
		}
		const { onChange } = this.props;
		this.state.stack.push(value);
		if(value === '.') {
			this.setState({
				dot_allowed: false,
				stack: this.state.stack
			});
		}else {
			this.setState({
				stack: this.state.stack
			});			
		}
		const result = this.state.stack.join("");
		onChange(result ? result : 0);
	}
	_popOut() {
		const { onChange } = this.props;
		var value = this.state.stack.pop();
		if(value === '.') {
			this.setState({
				dot_allowed: true,
				stack: this.state.stack
			});
		}else {
			this.setState({
				stack: this.state.stack
			});
		}
		const result = this.state.stack.join("");
		onChange(result ? result : 0);
	}
	render() {
		return (
				<Animatable.View
					ref={view => this.view = view } 
					style={{ position: 'absolute',bottom:0,left:0,right:0, backgroundColor: '#EFEFEF', borderWidth: 1, borderColor: '#EEEEEE' }}>
					
					<View style={{ flex: 1, flexDirection: 'row', flexWrap: 'wrap' }}>	
						<Number pushIn={this._pushIn.bind(this)}>1</Number>
						<View style={{ width: 1 }} />
						<Number pushIn={this._pushIn.bind(this)}>2</Number>
						<View style={{ width: 1 }} />
						<Number pushIn={this._pushIn.bind(this)}>3</Number>
					</View>
					<View style={{ height: 1 }} />
					<View style={{ flex: 1, flexDirection: 'row', flexWrap: 'wrap' }}>	
						<Number pushIn={this._pushIn.bind(this)}>4</Number>
						<View style={{ width: 1 }} />
						<Number pushIn={this._pushIn.bind(this)}>5</Number>
						<View style={{ width: 1 }} />
						<Number pushIn={this._pushIn.bind(this)}>6</Number>
					</View>
					<View style={{ height: 1 }} />
					<View style={{ flex: 1, flexDirection: 'row', flexWrap: 'wrap' }}>	
						<Number pushIn={this._pushIn.bind(this)}>7</Number>
						<View style={{ width: 1 }} />
						<Number pushIn={this._pushIn.bind(this)}>8</Number>
						<View style={{ width: 1 }} />
						<Number pushIn={this._pushIn.bind(this)}>9</Number>
					</View>
					<View style={{ height: 1 }} />
					<View style={{ flex: 1, flexDirection: 'row', flexWrap: 'wrap' }}>	
						<Number pushIn={this._pushIn.bind(this)}>.</Number>
						<View style={{ width: 1 }} />
						<Number pushIn={this._pushIn.bind(this)}>0</Number>
						<View style={{ width: 1 }} />
						<Signal popOut={this._popOut.bind(this)}>退格</Signal>
					</View>

				</Animatable.View>
			);
	}
}

export default NumberPad;

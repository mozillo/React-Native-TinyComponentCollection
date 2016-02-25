import React, {
	Component,
	ScrollView,
	View,
	Text,
	Image,
	TouchableOpacity,
	Dimensions,
	Platform,
	InteractionManager,
	StyleSheet,
} from 'react-native';
require('moment-range');
import moment from 'moment';

const { width, height } = Dimensions.get('window');
const activeOpacity = 1;

const styles = StyleSheet.create({
	scrollWrapper: {
		borderBottomWidth: 2,
		borderBottomColor: '#F06199',
	},
	container: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
	},
	rowColumn: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		marginHorizontal: 10,
		width: 100,
		height: 50,
	},
	rowText: {
		color: '#646464',
		fontSize: 16,
	},
	rowTextActive: {
		color: '#F06199',
		fontSize: 16,
	},
	arrow: {
		position: 'absolute',
		left: 32,
		bottom: 0,
		height: 8,
		width: 16,
	}
});
const dateFormat = 'YYYY-MM';

export default class TimeLine extends Component {

	constructor(props) {
		super(props);

		const { start, end } = this.props;
		let calendar = [];

		let range = moment.range(start, end);
		//I need a calendar range
		let index = 0
		range.by('months', (momentDate) => {
			calendar.push({
				index,
				date: momentDate.format(dateFormat),
				format: momentDate.format('YYYY年MM月')
			});
			++index;
		});
		//I need today object
		let today = { index: 0, date: moment().format(dateFormat), format: moment().format('YYYY年MM月') };

		//Set cursor on today
		for(key in calendar) {
			if(calendar[key].date == today.date) {
				today.index = parseInt(key)
			}
		}
		//Return state
		this.state = {
			calendar,
			selected: today,
		}
	}

	componentWillMount() {
		const { onSelect } = this.props;
		onSelect(this.state.selected);
	}

	componentDidMount() {
		if(this.refs.scrollView == undefined) {
			return ;
		}

		if(Platform.OS == 'ios') {
			this.refs.scrollView.scrollTo({ y: 0, x: (this.state.selected.index - 1) * 120 });
		}else if(Platform.OS == 'android') {
			setTimeout(() => {
				this.refs.scrollView.scrollTo({ y: 0, x: (this.state.selected.index - 1) * 120 });
			}, 0);
		}
	}

	moveTo(date) {
		var dateObject = { date: moment(date, dateFormat)};
		if(this.state.selected.date == dateObject.date) {
			//DO NOTHING IF SAME ITEM WAS CLICKED
			return ;
		}

		for(let key in this.state.calendar) {
			if(this.state.calendar[key].date == dateObject.date) {
				this._updateFrame(this.state.calendar[key]);
			}
		}
	}

	_updateFrame(dateTime) {
		const { onSelect } = this.props;

		this.setState({
			selected: dateTime
		});

		if(this.refs.scrollView)
			this.refs.scrollView.scrollTo({ y: 0, x: (dateTime.index - 1) * 120 });

		//Run after rendering
		InteractionManager.runAfterInteractions(() => {
			onSelect(dateTime);
		});
	}

	renderNode(dateObject, key) {
		if(this.state.selected.date == dateObject.date) {
			return (
				<TouchableOpacity
					key={dateObject.format}
					onPress={this._updateFrame.bind(this, dateObject)}
					style={styles.rowColumn}
					activeOpacity={activeOpacity}>
					<Text style={styles.rowTextActive}>{dateObject.format}</Text>
					<Image source={require('./active_arrow.png')} style={styles.arrow} />
				</TouchableOpacity>
			)
		}else {
			return (
				<TouchableOpacity
					key={dateObject.format}
					onPress={this._updateFrame.bind(this, dateObject)}
					style={styles.rowColumn}
					activeOpacity={activeOpacity}>
					<Text style={styles.rowText}>{dateObject.format}</Text>
				</TouchableOpacity>
			)
		}
	}

	render() {
		const { backgroundColor } = this.props;
		const { calendar } = this.state;
		let userStyles = backgroundColor?backgroundColor:'#FFFFFF';
		return (
			<View style={[styles.scrollWrapper, {backgroundColor: userStyles}]}>
				<ScrollView
					ref={"scrollView"}
					automaticallyAdjustContentInsets={false	}
					showsHorizontalScrollIndicator={false}
					horizontal={true}
					contentContainerstyle={styles.container}>

					{Object.keys(calendar).map((key) => (
							this.renderNode(calendar[key])
					))}

				</ScrollView>
			</View>
		);
	}
}

TimeLine.propTypes = {
	scrollTo: React.PropTypes.func,
	onSelect: React.PropTypes.func.isRequired,
	backgroundColor: React.PropTypes.string,
	start: React.PropTypes.string.isRequired,
	end: React.PropTypes.string.isRequired,
}

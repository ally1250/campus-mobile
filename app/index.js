'use strict';

import React, { Component } from 'react';
import {
	AppRegistry,
	NavigatorIOS,
	BackAndroid,
	StatusBar,
	AppState,
	View
} from 'react-native';

// SETUP / UTIL / NAV
var AppSettings = 			require('./AppSettings'),
	general = 				require('./util/general'),
	logger = 				require('./util/logger'),

// VIEWS
	Home = 					require('./views/Home'),
	ShuttleStop = 			require('./views/ShuttleStop'),
	SurfReport = 			require('./views/weather/SurfReport'),
	DiningList = 			require('./views/dining/DiningList'),
	DiningDetail = 			require('./views/dining/DiningDetail'),
	DiningNutrition = 		require('./views/dining/DiningNutrition'),
	NewsDetail = 			require('./views/news/NewsDetail'),
	EventDetail = 			require('./views/events/EventDetail'),
	WebWrapper = 			require('./views/WebWrapper');

import GeoLocationContainer from './containers/geoLocationContainer';

import WelcomeWeekView from './views/welcomeWeek/WelcomeWeekView';
import EventListView from './views/events/EventListView';
import NewsListView from './views/news/NewsListView';
import DiningListView from './views/dining/DiningListView';
import FeedbackView from './views/FeedbackView';

// NAV
import NavigationBarWithRouteMapper from './views/NavigationBarWithRouteMapper';

// REDUX
import { Provider } from 'react-redux';
import configureStore from './store/configureStore';

var nowucsandiego = React.createClass({

	store: configureStore(),

	getInitialState() {
		return {
			inHome: true,
		};
	},

	componentWillMount() {
		AppState.addEventListener('change', this.handleAppStateChange);
	},

	componentDidMount() {
		if (general.platformAndroid() || AppSettings.NAVIGATOR_ENABLED) {
			// Listen to route focus changes
			// Should be a better way to do this...
			this.refs.navRef.refs.navRef.navigationContext.addListener('willfocus', (event) => {

				const route = event.data.route;

				// Make sure renders/card refreshes are only happening when in home route
				if (route.id === "Home") {
					this.setState({inHome: true});
				} else {
					this.setState({inHome: false});
				}
			});

			// Listen to back button on Android
			BackAndroid.addEventListener('hardwareBackPress', () => {
				//console.log(util.inspect(this.refs.navRef.refs.navRef.getCurrentRoutes()));
				//var route = this.refs.navRef.refs.navRef.getCurrentRoutes()[0];

				if(this.state.inHome) {
					BackAndroid.exitApp();
					return false;

				} else {
					this.refs.navRef.refs.navRef.pop();
					return true;
				}
			});
		}
		else {
			// Pause/resume timeouts
			this.refs.navRef.navigationContext.addListener('didfocus', (event) => {
				const route = event.data.route;

				// Make sure renders/card refreshes are only happening when in home route
				if (route.id === undefined) { //undefined is foxusing "Home"... weird I know
					this.setState({inHome: true});
				} else {
					this.setState({inHome: false});
				}
			});

			// Make all back buttons use text "Back"
			this.refs.navRef.navigationContext.addListener('willfocus', (event) => {
				const route = event.data.route;
				route.backButtonTitle = "Back";
			});
		}
	},

	componentWillUnmount() {
		AppState.removeEventListener('change', this.handleAppStateChange);
	},

	render: function() {

		if (general.platformIOS()) {
			StatusBar.setBarStyle('light-content');
		}

		if (general.platformAndroid() || AppSettings.NAVIGATOR_ENABLED) {
			return (
				<Provider store={this.store}>
					<View style={{ flex: 1 }}>
						<GeoLocationContainer />
						<NavigationBarWithRouteMapper
							ref="navRef"
							route={{ id: 'Home', name: 'Home', title: 'now@ucsandiego' }}
							renderScene={this.renderScene}
						/>
					</View>
				</Provider>
			);
		} else {
			return (
				<Provider store={this.store}>
					<View style={{ flex: 1 }}>
						<GeoLocationContainer />
						<NavigatorIOS
							initialRoute={{
								component: Home,
								title: AppSettings.APP_NAME,
								passProps: {
									isSimulator: this.props.isSimulator
								},
								backButtonTitle: 'Back'
							}}
							style={{ flex: 1 }}
							tintColor='#FFFFFF'
							barTintColor='#006C92'
							titleTextColor='#FFFFFF'
							navigationBarHidden={false}
							translucent={true}
							ref="navRef"
						/>
					</View>
				</Provider>
			);
		}
	},

	renderScene: function(route, navigator, index, navState) {

		switch (route.id) {
			case 'Home': 				return (<Home route={route} navigator={navigator}/>);
			case 'ShuttleStop': 		return (<ShuttleStop route={route} navigator={navigator} />);
			case 'SurfReport': 			return (<SurfReport route={route} navigator={navigator} />);
			case 'DiningListView': 		return (<DiningListView route={route} navigator={navigator} />);
			case 'DiningDetail': 		return (<DiningDetail route={route} navigator={navigator} />);
			case 'DiningNutrition': 	return (<DiningNutrition route={route} navigator={navigator} />);
			case 'NewsDetail': 			return (<NewsDetail route={route} navigator={navigator} />);
			case 'EventDetail': 		return (<EventDetail route={route} navigator={navigator} />);
			case 'WebWrapper': 			return (<WebWrapper route={route} navigator={navigator} />);
			case 'WelcomeWeekView': 	return (<WelcomeWeekView route={route} navigator={navigator} />);
			case 'EventListView': 		return (<EventListView route={route} navigator={navigator} />);
			case 'NewsListView': 		return (<NewsListView route={route} navigator={navigator} />);
			case 'FeedbackView': 		return (<FeedbackView route={route} navigator={navigator} />);
			default: 					return (<Home route={route} navigator={navigator} />);
		}
	}
});

module.exports = nowucsandiego;

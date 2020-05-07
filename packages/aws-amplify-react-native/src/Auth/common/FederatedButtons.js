import React from 'react';
import { View } from 'react-native';
import GoogleButton from './GoogleButton';

const FederatedButtons = props => {
	return (
		<View>
			<GoogleButton
				changeState={props.changeState}
				clientIDs={props.federated.google}
			/>
		</View>
	);
};

export default FederatedButtons;

import React, { useEffect, useState } from 'react';
import { View, Button } from 'react-native';
import {
	GoogleSignin,
	GoogleSigninButton,
	statusCodes,
} from '@react-native-community/google-signin';
import { Auth } from 'aws-amplify';
import jwt_decode from 'jwt-decode';

const GoogleButton = props => {
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		GoogleSignin.configure({
			iosClientId: props.clientIDs.ios,
		});
	}, []);

	async function signIn() {
		try {
			setLoading(true);
			await GoogleSignin.hasPlayServices();
			const userInfo = await GoogleSignin.signIn();

			const { idToken, user } = userInfo;

			const decoded = jwt_decode(idToken);

			await Auth.federatedSignIn(
				'google',
				{ token: idToken, expires_at: decoded.exp },
				{
					email: user.email,
					name: user.name,
					picture: user.photo,
				}
			);

			const authenticatedUser = await Auth.currentAuthenticatedUser();

			console.log(authenticatedUser);
			setLoading(false);
			props.changeState('signedIn', authenticatedUser);
		} catch (error) {
			console.log('ERROR: ', error);
			setLoading(false);
		}
	}

	return (
		<View>
			<GoogleSigninButton
				style={{ width: 192, height: 48 }}
				size={GoogleSigninButton.Size.Wide}
				color={GoogleSigninButton.Color.Dark}
				onPress={signIn}
				disabled={loading}
			/>
		</View>
	);
};

export default GoogleButton;

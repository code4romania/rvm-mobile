import React from 'react';
import {
  ActivityIndicator,
  Image,
  Button,
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  TextInput,
  Text,
  View,
} from 'react-native';
import { login } from '../api/login';
import {
  LoginText,
  PhoneNumberInputPlaceholder,
  SecurityCodeInputPlaceholder,
} from '../constants/Strings';

export default class LoginScreen extends React.Component {
  constructor() {
    super();
    this.state = {
      phoneNumber: '',
      securityCode: '',
      errorMessage: null,
      loginInProgress: false,
    };
  }

  _handleLoginPressed = () => {
    this.setState({ loginInProgress: true, errorMessage: null });

    login({
      phoneNumber: this.state.phoneNumber,
      securityCode: this.state.securityCode,
    })
      .then(({ authToken }) => {
        console.log(`Login successful (authToken: ${authToken})`);
        // TODO: switch screen
        // this.props.navigation.navigate('Main');
      })
      .catch(({ errorMessage }) => {
        this.setState({ errorMessage });
        console.log(`Login failed (errorMessage: ${errorMessage})`);
      })
      .finally(() => {
        this.setState({ loginInProgress: false });
      });
  };

  _handlePhoneNumberChange = value => {
    this.setState({ phoneNumber: value, errorMessage: null });
  };

  _handleSecurityCodeChange = value => {
    this.setState({ securityCode: value, errorMessage: null });
  };

  render() {
    return (
      <KeyboardAvoidingView style={styles.screen} behavior="padding" enabled>
        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.contentContainer}
        >
          <View style={styles.logoContainer}>
            <Image
              source={require('../assets/images/dsu-logo.png')}
              style={styles.logo}
            />
            {this.state.loginInProgress ? (
              <ActivityIndicator
                color="#FFCC00"
                size={100}
                style={styles.loader}
              />
            ) : null}
            {this.state.errorMessage ? (
              <Text style={styles.errorMessage}>{this.state.errorMessage}</Text>
            ) : null}
          </View>

          <TextInput
            disabled={this.state.loginInProgress}
            style={styles.phoneNumberInput}
            value={this.state.phoneNumber}
            onChangeText={this._handlePhoneNumberChange}
            placeholder={PhoneNumberInputPlaceholder}
            keyboardType="numeric"
          />

          <TextInput
            disabled={this.state.loginInProgress}
            style={styles.securityCodeInput}
            value={this.state.securityCode}
            onChangeText={this._handleSecurityCodeChange}
            placeholder={SecurityCodeInputPlaceholder}
          />
        </ScrollView>
        <View style={styles.loginButtonContainer}>
          <Button
            style={styles.loginButton}
            disabled={this.state.loginInProgress}
            title={LoginText}
            color={'#FFCC00'}
            onPress={this._handleLoginPressed}
          />
        </View>
      </KeyboardAvoidingView>
    );
  }
}

const LogoBorderRadius = 180;

const inputStyles = {
  height: 40,
  color: '#FFF',
  width: '100%',
  fontSize: 17,
  height: 80,
  padding: 22,
  textDecorationColor: '#FFF',
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: '#264998',
  },
  contentContainer: {
    alignItems: 'center',
  },
  loader: {
    position: 'absolute',
  },
  errorMessage: {
    position: 'absolute',
    top: 200,
    fontSize: 17,
    color: 'red',
  },
  logoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: LogoBorderRadius / 2,
    width: LogoBorderRadius,
    height: LogoBorderRadius,
    backgroundColor: '#FFF',
    marginVertical: 147,
  },
  logo: {},
  loginButton: {},
  loginButtonContainer: {
    position: 'absolute',
    width: '100%',
    bottom: 0,
    backgroundColor: '#FFCC00',
  },

  phoneNumberInput: {
    ...inputStyles,
  },

  securityCodeInput: {
    ...inputStyles,
  },
});



import React from 'react';

import {
  View,
  Modal,
  Text,
  ScrollView,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Platform,
} from 'react-native';

import styles from './style';

let componentIndex = 0;

const defaultProps = {
  data: [],
  onChange: () => {},
  onModalOpen: () => {},
  onModalClose: () => {},
  keyExtractor: item => item.key,
  labelExtractor: item => item.label,
  visible: false,
  closeOnChange: true,
  initValue: 'Select me!',
  animationType: 'slide',
  style: {},
  selectStyle: {},
  selectTextStyle: {},
  optionStyle: {},
  optionTextStyle: {},
  optionContainerStyle: {},
  sectionStyle: {},
  childrenContainerStyle: {},
  touchableStyle: {},
  touchableActiveOpacity: 0.2,
  sectionTextStyle: {},
  cancelContainerStyle: {},
  cancelStyle: {},
  cancelTextStyle: {},
  overlayStyle: {},
  cancelText: 'cancel',
  disabled: false,
  supportedOrientations: ['portrait', 'landscape'],
  keyboardShouldPersistTaps: 'always',
  backdropPressToClose: false,
  accessible: false,
  scrollViewAccessibilityLabel: undefined,
  cancelButtonAccessibilityLabel: undefined,
  passThruProps: {},
  modalOpenerHitSlop: {
    top: 0, bottom: 0, left: 0, right: 0,
  },
  customSelector: undefined,
};

export default class PickerWrapper extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      modalVisible: props.visible,
      selected: props.initValue,
      cancelText: props.cancelText,
      changedItem: undefined,
    };
  }

  componentDidUpdate(prevProps, prevState) {
    const newState = {};
    let doUpdate = false;
    if (prevProps.initValue !== this.props.initValue) {
      newState.selected = this.props.initValue;
      doUpdate = true;
    }
    if (prevProps.visible !== this.props.visible) {
      newState.modalVisible = this.props.visible;
      doUpdate = true;
    }
    if (doUpdate) {
      this.setState(newState);
    }
  }

    onChange = (item) => {
      if (Platform.OS === 'android' || !Modal.propTypes.onDismiss) {
        // RN >= 0.50 on iOS comes with the onDismiss prop for Modal which solves RN issue #10471
        this.props.onChange(item);
      }
      this.setState({ selected: this.props.labelExtractor(item), changedItem: item });

      if (this.props.closeOnChange) { this.close(); }
    }

    close = () => {
      this.props.onModalClose();
      this.setState({
        modalVisible: false,
      });
    }

    open = () => {
      this.props.onModalOpen();
      this.setState({
        modalVisible: true,
        changedItem: undefined,
      });
    }

    renderSection = section => (
      <View key={this.props.keyExtractor(section)} style={[styles.sectionStyle, this.props.sectionStyle]}>
        <Text style={[styles.sectionTextStyle, this.props.sectionTextStyle]}>
          {this.props.labelExtractor(section)}
        </Text>
      </View>
    )

    renderOption = (option, isLastItem) => (
      <TouchableOpacity
        key={this.props.keyExtractor(option)}
        onPress={() => this.onChange(option)}
        activeOpacity={this.props.touchableActiveOpacity}
        accessible={this.props.accessible}
        accessibilityLabel={option.accessibilityLabel || undefined}
        {...this.props.passThruProps}
      >
        <View style={[styles.optionStyle, this.props.optionStyle, isLastItem
                && { borderBottomWidth: 0 }]}
        >
          <Text style={[styles.optionTextStyle, this.props.optionTextStyle]}>
            {this.props.labelExtractor(option)}
          </Text>
        </View>
      </TouchableOpacity>)

    modalClose = () => {
      const closeOverlay = this.props.backdropPressToClose;
      closeOverlay && this.close()
    }

    renderOptionList = () => {
      const options = this.props.data.map((item, index) => {
        if (item.section) {
          return this.renderSection(item);
        }
        return this.renderOption(item, index === this.props.data.length - 1);
      });

      return (
        <TouchableWithoutFeedback
          key={`modalSelector${componentIndex++}`}
          accessible={false}
          onPress={this.modalClose}
        >
          <View style={[styles.overlayStyle, this.props.overlayStyle]}>
            <View style={[styles.optionContainer, this.props.optionContainerStyle]}>
              <ScrollView keyboardShouldPersistTaps={this.props.keyboardShouldPersistTaps} accessible={this.props.accessible} accessibilityLabel={this.props.scrollViewAccessibilityLabel}>
                <View style={{ paddingHorizontal: 10 }}>
                  {options}
                </View>
              </ScrollView>
            </View>
            <View style={[styles.cancelContainer, this.props.cancelContainerStyle]}>
              <TouchableOpacity onPress={this.close} activeOpacity={this.props.touchableActiveOpacity} accessible={this.props.accessible} accessibilityLabel={this.props.cancelButtonAccessibilityLabel}>
                <View style={[styles.cancelStyle, this.props.cancelStyle]}>
                  <Text style={[styles.cancelTextStyle, this.props.cancelTextStyle]}>
                    {this.props.cancelText}
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>);
    }

    renderChildren = () => {
      if (this.props.children) {
        return this.props.children;
      }
      return (
        <View style={[styles.selectStyle, this.props.selectStyle]}>
          <Text style={[styles.selectTextStyle, this.props.selectTextStyle]}>
            {this.state.selected}
          </Text>
        </View>
      );
    }

    render() {
      const dp = (
        <Modal
          transparent
          ref={element => this.model = element}
          supportedOrientations={this.props.supportedOrientations}
          visible={this.state.modalVisible}
          onRequestClose={this.close}
          animationType={this.props.animationType}
          onDismiss={() => this.state.changedItem && this.props.onChange(this.state.changedItem)}
        >
          {this.renderOptionList()}
        </Modal>
      );

      return (
        <View style={this.props.style} {...this.props.passThruProps}>
          {dp}
          {this.props.customSelector
            ? this.props.customSelector
            : (
              <TouchableOpacity
                hitSlop={this.props.modalOpenerHitSlop}
                activeOpacity={this.props.touchableActiveOpacity}
                style={this.props.touchableStyle}
                onPress={this.open}
                disabled={this.props.disabled}
              >
                <View style={this.props.childrenContainerStyle} pointerEvents="none">
                  {this.renderChildren()}
                </View>
              </TouchableOpacity>
            )
                }
        </View>
      );
    }
}

PickerWrapper.defaultProps = defaultProps;

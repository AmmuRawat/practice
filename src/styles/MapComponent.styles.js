import { StyleSheet, Dimensions } from 'react-native';

const { width: windowWidth, height: windowHeight } = Dimensions.get('window');

const styles = StyleSheet.create({
    map: {
        flex: 1,
    }, container: {
        flex: 1,
    }, blackOverlay: {
        // position: 'absolute',
        // bottom: 10,
        // right: 10,
        // height: 120,
        // width: 170,
        // backgroundColor: 'black',
        // zIndex: 10
    }, modalView: {
        position: 'absolute',
        height: windowWidth * 0.177,
        top: windowHeight * 0.20,
        left: windowWidth * 0.275,
        zIndex: 2,
        margin: windowHeight * 0.17,
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        borderRadius: 10,
        paddingTop: windowHeight * 0.04,
        alignItems: "center",
        borderColor: '#06d6a0',
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        width: windowWidth * 0.26,
        alignSelf: 'center',
    },
    inputContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 15,
        // paddingTop: windowHeight * 0.0001,
    },
    inputLabel: {
        fontSize: windowHeight * 0.020,
        fontWeight: 'bold',
        marginRight: windowHeight * 0.05,
        color: '#fff'
    },
    textInput: {
        height: windowHeight * 0.06,
        width: "20%",
        borderColor: '#06d6a0',
        borderRadius: 10,
        color: "white",
        borderWidth: 2,
        fontSize: windowHeight * 0.025,
        paddingLeft: windowHeight * 0.03,
    },
    buttonContainer: {
        flexDirection: "row",
        justifyContent: "space-evenly",
        width: "90%",
    },

    button: {
        borderRadius: windowHeight * 0.02,
        padding: 10,
        elevation: 2,
        backgroundColor: "#2196F3",
    },
    buttonText: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center",
    },
    swipeButtonContainer: {
        position: 'absolute',
        bottom: windowHeight * 0.04,
        left: windowWidth * 0.325,
    }
})

export default styles;
import { StyleSheet } from "react-native";

const compStyles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 20,
        paddingVertical: 20,
        padding: 20
    },

    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },

    text: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'left',
    },

    addButton: {
        position: 'absolute',
        bottom: 20,
        right: 20,
        borderRadius: 20,
        paddingHorizontal: 20,
        height: 50,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },

    normalButton: {
        height: 50,
        // width: 150,
        paddingHorizontal: 30,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },

    wholeWidthContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        width: "100%",
    },

    buttonContainer: {
        display: 'flex',
        flexDirection: 'row'
    },

    normalButtonText: {
        fontSize: 22,
        fontWeight: 'bold',
    },

    addButtonSymbol: {
        fontSize: 24,
        fontWeight: 'bold',
    },

    addButtonText: {
        fontSize: 18,
        fontWeight: 'bold',
        paddingLeft: 7
    },

    instructionContainer: {
        marginBottom: 20,
    },

    step: {
        fontSize: 16,
        marginBottom: 10,
    },

    subStep: {
        fontSize: 16,
        marginLeft: 20,
        marginBottom: 5,
    },

    sectionContainer: {
        marginTop: 20,
    }
});

export default compStyles;

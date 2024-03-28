import { StyleSheet } from "react-native";

const compStyles = StyleSheet.create({
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

    addButtonSymbol: {
        fontSize: 24,
        fontWeight: 'bold',
    },

    addButtonText: {
        fontSize: 18,
        fontWeight: 'bold',
        paddingLeft: 7
    },
});

export default compStyles;

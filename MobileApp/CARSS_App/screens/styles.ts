import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // justifyContent: 'center',
        // alignItems: 'center',
        padding: 20,
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
        backgroundColor: 'red',
        borderRadius: 20,
        paddingHorizontal: 20,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    }
});

export default styles;

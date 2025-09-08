import { Text } from '@rneui/themed';
import React from 'react';
import { StyleSheet, View } from 'react-native';

const HistoryScreen: React.FC = () => {
    return (
        <View style={styles.container}>
            <Text h4>Geçmiş</Text>
            <Text>İşlem geçmişi listesi burada olacak.</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 16 },
});

export default HistoryScreen;



import { Text } from '@rneui/themed';
import React from 'react';
import { StyleSheet, View } from 'react-native';

const SettingsScreen: React.FC = () => {
    return (
        <View style={styles.container}>
            <Text h4>Ayarlar</Text>
            <Text>Uygulama ayarları burada olacak.</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 16 },
});

export default SettingsScreen;



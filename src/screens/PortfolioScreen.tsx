import { Text } from '@rneui/themed';
import React from 'react';
import { StyleSheet, View } from 'react-native';

const PortfolioScreen: React.FC = () => {
    return (
        <View style={styles.container}>
            <Text h4>Portföy</Text>
            <Text>Toplam maliyet, güncel değer, kâr/zarar burada görünecek.</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 16 },
});

export default PortfolioScreen;



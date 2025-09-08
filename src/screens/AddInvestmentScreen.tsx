import { Button, Input, Text } from '@rneui/themed';
import React from 'react';
import { StyleSheet, View } from 'react-native';

const AddInvestmentScreen: React.FC = () => {
    return (
        <View style={styles.container}>
            <Text h4>Yatırım Ekle</Text>
            <View style={styles.form}>
                <Input placeholder="Tür (Altın, USD, Euro, vb.)" />
                <Input placeholder="Alış Fiyatı" keyboardType="decimal-pad" />
                <Input placeholder="Miktar" keyboardType="decimal-pad" />
                <Input placeholder="Alış Tarihi (YYYY-MM-DD)" />
                <Button title="Kaydet" />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 16 },
    form: { marginTop: 16 },
});

export default AddInvestmentScreen;



import { StyleSheet } from 'react-native';
import { colors } from '../theme';

export default StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.light, padding: 16 },
  label: { marginTop: 10, marginBottom: 4, color: colors.dark },
  input: { backgroundColor: colors.white },
  button: { marginTop: 20 }
});

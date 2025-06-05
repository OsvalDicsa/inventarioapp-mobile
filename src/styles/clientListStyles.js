import { StyleSheet } from 'react-native';
import { colors } from '../theme';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 16
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    color: colors.dark
  },
  badgeContainer: {
    marginLeft: 8,
    backgroundColor: colors.danger,
    borderRadius: 12,
    minWidth: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6
  },
  badgeText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '600'
  },
  offlineText: {
    color: colors.danger,
    marginBottom: 8,
    fontSize: 14
  },
  searchContainer: {
    marginBottom: 12
  },
  searchInput: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 6,
    backgroundColor: colors.white,
    paddingVertical: 10,
    paddingHorizontal: 12,
    fontSize: 16,
    color: colors.dark
  },
  item: {
    backgroundColor: colors.white,
    padding: 16,
    borderRadius: 6,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: colors.border
  },
  itemText: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.dark
  },
  itemSubText: {
    fontSize: 13,
    color: colors.muted,
    marginTop: 4
  },
  emptyContainer: {
    marginTop: 32,
    alignItems: 'center'
  },
  emptyText: {
    fontSize: 16,
    color: colors.muted
  }
});

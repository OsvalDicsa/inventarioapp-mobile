import { StyleSheet } from 'react-native';
import { colors } from '../theme';

export default StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.light
  },
  flex: {
    flex: 1
  },
  container: {
    padding: 16,
    paddingBottom: 32
  },
  headerContainer: {
    marginBottom: 24
  },
  headerText: {
    fontSize: 16,
    color: colors.muted
  },
  clientName: {
    fontSize: 22,
    fontWeight: '600',
    color: colors.dark,
    marginTop: 4
  },

  // Dropdown “artículo”
  sectionCard: {
    backgroundColor: colors.white,
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: colors.border
  },
  sectionError: {
    borderColor: colors.danger
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.dark,
    marginBottom: 8
  },
  dropdownInput: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 6,
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: colors.light
  },
  dropdownText: {
    fontSize: 15,
    color: colors.dark
  },
  dropdownPlaceholder: {
    fontSize: 15,
    color: colors.muted
  },

  // Modal
  modalContainer: {
    flex: 1,
    backgroundColor: colors.white
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.dark
  },
  modalCloseButton: {
    padding: 8
  },
  modalCloseText: {
    fontSize: 16,
    color: colors.primary
  },
  modalSearchInput: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 6,
    margin: 16,
    paddingVertical: 8,
    paddingHorizontal: 12,
    fontSize: 16,
    backgroundColor: colors.light,
    color: colors.dark
  },
  articuloItem: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border
  },
  articuloText: {
    fontSize: 16,
    color: colors.dark
  },
  modalEmpty: {
    marginTop: 32,
    alignItems: 'center'
  },
  modalEmptyText: {
    fontSize: 16,
    color: colors.muted
  },

  // Resto del formulario
  textInput: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 6,
    paddingVertical: 10,
    paddingHorizontal: 12,
    fontSize: 15,
    backgroundColor: colors.light,
    color: colors.dark
  },
  photoPreview: {
    width: '100%',
    height: 200,
    borderRadius: 6,
    marginBottom: 12,
    backgroundColor: colors.border
  },
  photoPlaceholder: {
    width: '100%',
    height: 200,
    borderRadius: 6,
    marginBottom: 12,
    backgroundColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center'
  },
  photoPlaceholderText: {
    color: colors.muted,
    fontSize: 16
  },
  photoButtonWrapper: {
    width: '50%',
    alignSelf: 'flex-start'
  },
  saveButtonWrapper: {
    marginTop: 10,
    marginHorizontal: 40
  }
});

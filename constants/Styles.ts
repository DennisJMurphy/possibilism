import { StyleSheet } from 'react-native'

export const groupStyles = StyleSheet.create({
  container: {
    padding: 50,
    flex: 1,
    justifyContent: 'center',
  },
  header: {
    fontSize: 20,
    marginBottom: 4,
    fontWeight: 'bold',
  },
  subheader: {
    fontSize: 14,
    marginBottom: 16,
  },
  groupCard: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
  },
  groupName: {
    fontSize: 16,
    fontWeight: '500',
  },
  groupDescription: {
    marginTop: 4,
  },
  userTotal: {
    fontWeight: '600',
  },
  footerButton: {
    marginTop: 20,
    marginBottom: 40,
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
  },
  footerButtonText: {
    textAlign: 'center',
    fontSize: 14,
  },
  logoutButton: {
    marginBottom: 30,
    padding: 8,
    borderRadius: 6,
  },
  logoutButtonText: {
    textAlign: 'center',
    fontSize: 12,
  },
  trackingButton: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 80,
  },
})

export const loginStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  logo: {
    width: 80,
    height: 80,
    alignSelf: 'center',
    marginBottom: 16,
    borderRadius: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    marginBottom: 10,
    padding: 8,
    borderRadius: 6,
  },
  button: {
    marginBottom: 16,
  },
  linkContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 12,
  },
  link: {
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  message: {
    marginTop: 20,
    fontSize: 14,
    textAlign: 'center',
  },
})

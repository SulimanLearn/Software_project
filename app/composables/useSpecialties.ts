import { specialties as localSpecialties, type Specialty } from '~/data/specialties'

export const useSpecialties = () => {
  const { authFetch } = useAuth()
  const specialties = useState<Specialty[]>('api-specialties', () => localSpecialties)
  const specialtiesLoading = useState('api-specialties-loading', () => false)
  const specialtiesError = useState<string | null>('api-specialties-error', () => null)

  const fetchSpecialties = async () => {
    specialtiesLoading.value = true
    specialtiesError.value = null

    try {
      const response = await authFetch<Specialty[]>('/specialties')
      specialties.value = response.length ? response : localSpecialties
      return specialties.value
    } catch (error) {
      specialties.value = localSpecialties
      specialtiesError.value = 'تعذر تحميل التخصصات من الخادم، تم عرض البيانات المحلية مؤقتاً.'
      return specialties.value
    } finally {
      specialtiesLoading.value = false
    }
  }

  return {
    specialties,
    specialtiesLoading,
    specialtiesError,
    fetchSpecialties,
  }
}

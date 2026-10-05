import { useMutation } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { useLanguage } from '@/contexts/LanguageContext';
import { toast } from 'sonner';
import { useTranslation } from '@/hooks/useTranslation';

interface ContactData {
  name: string;
  phone: string;
  content: string;
}

export const useContact = () => {
  const { language } = useLanguage();
  const { t } = useTranslation('contact');

  return useMutation({
    mutationFn: async (data: ContactData) => {
      const response = await api.submitContact(data, language);
      return response;
    },
    onSuccess: () => {
      toast.success(t('message_sent_successfully'));
    },
    onError: (error: any) => {
      console.error('Contact submission error:', error);
      
      // Check if it's an authentication error
      if (error?.message?.includes('unauthorized') || error?.message?.includes('401')) {
        toast.error(t('please_login_first'));
      } else {
        toast.error(t('failed_to_send_message'));
      }
    },
  });
};

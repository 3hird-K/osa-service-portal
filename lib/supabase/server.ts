export const createClient = async () => {
  return {
    auth: {
      getUser: async () => ({ data: { user: null }, error: null }),
      signOut: async () => {},
      getClaims: async() => ({ data: null }),
    },
    from: (table: string) => ({
      select: () => ({ eq: () => ({ single: async () => ({ data: null, error: null }), order: async () => ({ data: [], error: null }) }) }),
      insert: () => ({ select: () => ({ single: async () => ({ data: null, error: null }) }) }),
      update: () => ({ eq: () => ({ select: () => ({ single: async () => ({ data: null, error: null }) }) }) }),
      delete: () => ({ eq: async () => ({ error: null }) }),
    }),
    storage: { 
      from: () => ({ 
        upload: async () => ({ error: null }), 
        getPublicUrl: () => ({ data: { publicUrl: "" } }) 
      }) 
    }
  };
};

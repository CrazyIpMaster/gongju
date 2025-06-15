// 用户管理工具类
export interface UserInfo {
  id: string;
  phone: string;
  nickname: string;
  avatar?: string;
  companyId?: string;
  companyName?: string;
  role: 'admin' | 'member' | 'pending'; // 管理员、成员、待审核
  createTime: number;
  lastLoginTime: number;
}

export interface Company {
  id: string;
  name: string;
  adminPhone: string;
  adminId: string;
  description?: string;
  createTime: number;
  memberCount: number;
  status: 'active' | 'inactive';
}

export interface CompanyApplication {
  id: string;
  userId: string;
  userPhone: string;
  userNickname: string;
  companyId: string;
  companyName: string;
  status: 'pending' | 'approved' | 'rejected';
  applyTime: number;
  processTime?: number;
  processBy?: string;
}

class UserManager {
  private static instance: UserManager;
  private currentUser: UserInfo | null = null;
  private storageKeys = {
    currentUser: 'current_user',
    userList: 'user_list',
    companyList: 'company_list',
    applicationList: 'application_list'
  };

  static getInstance(): UserManager {
    if (!UserManager.instance) {
      UserManager.instance = new UserManager();
    }
    return UserManager.instance;
  }

  // 初始化用户管理器
  init(): void {
    try {
      const userData = wx.getStorageSync(this.storageKeys.currentUser);
      if (userData) {
        this.currentUser = JSON.parse(userData);
      }
    } catch (error) {
      console.error('初始化用户数据失败:', error);
    }
  }

  // 生成唯一ID
  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  // 验证手机号格式
  private validatePhone(phone: string): boolean {
    const phoneRegex = /^1[3-9]\d{9}$/;
    return phoneRegex.test(phone);
  }

  // 用户注册
  async register(phone: string, nickname: string, password: string): Promise<{ success: boolean; message: string; user?: UserInfo }> {
    try {
      if (!this.validatePhone(phone)) {
        return { success: false, message: '请输入正确的手机号码' };
      }

      if (!nickname.trim()) {
        return { success: false, message: '请输入昵称' };
      }

      if (password.length < 6) {
        return { success: false, message: '密码长度不能少于6位' };
      }

      // 检查手机号是否已注册
      const existingUsers = this.getAllUsers();
      const existingUser = existingUsers.find(user => user.phone === phone);
      if (existingUser) {
        return { success: false, message: '该手机号已注册' };
      }

      // 创建新用户
      const newUser: UserInfo = {
        id: this.generateId(),
        phone,
        nickname: nickname.trim(),
        role: 'member',
        createTime: Date.now(),
        lastLoginTime: Date.now()
      };

      // 保存用户信息
      existingUsers.push(newUser);
      wx.setStorageSync(this.storageKeys.userList, JSON.stringify(existingUsers));

      // 保存密码（实际项目中应该加密存储）
      wx.setStorageSync(`password_${phone}`, password);

      return { success: true, message: '注册成功', user: newUser };
    } catch (error) {
      console.error('注册失败:', error);
      return { success: false, message: '注册失败，请重试' };
    }
  }

  // 用户登录
  async login(phone: string, password: string): Promise<{ success: boolean; message: string; user?: UserInfo }> {
    try {
      if (!this.validatePhone(phone)) {
        return { success: false, message: '请输入正确的手机号码' };
      }

      // 查找用户
      const users = this.getAllUsers();
      const user = users.find(u => u.phone === phone);
      if (!user) {
        return { success: false, message: '用户不存在，请先注册' };
      }

      // 验证密码
      const storedPassword = wx.getStorageSync(`password_${phone}`);
      if (storedPassword !== password) {
        return { success: false, message: '密码错误' };
      }

      // 更新最后登录时间
      user.lastLoginTime = Date.now();
      this.updateUser(user);

      // 设置当前用户
      this.currentUser = user;
      wx.setStorageSync(this.storageKeys.currentUser, JSON.stringify(user));

      return { success: true, message: '登录成功', user };
    } catch (error) {
      console.error('登录失败:', error);
      return { success: false, message: '登录失败，请重试' };
    }
  }

  // 退出登录
  logout(): void {
    this.currentUser = null;
    wx.removeStorageSync(this.storageKeys.currentUser);
  }

  // 获取当前用户
  getCurrentUser(): UserInfo | null {
    return this.currentUser;
  }

  // 检查是否已登录
  isLoggedIn(): boolean {
    return this.currentUser !== null;
  }

  // 获取所有用户
  private getAllUsers(): UserInfo[] {
    try {
      const usersData = wx.getStorageSync(this.storageKeys.userList);
      return usersData ? JSON.parse(usersData) : [];
    } catch (error) {
      console.error('获取用户列表失败:', error);
      return [];
    }
  }

  // 更新用户信息
  updateUser(user: UserInfo): void {
    try {
      const users = this.getAllUsers();
      const index = users.findIndex(u => u.id === user.id);
      if (index !== -1) {
        users[index] = user;
        wx.setStorageSync(this.storageKeys.userList, JSON.stringify(users));
        
        // 如果是当前用户，同时更新当前用户信息
        if (this.currentUser && this.currentUser.id === user.id) {
          this.currentUser = user;
          wx.setStorageSync(this.storageKeys.currentUser, JSON.stringify(user));
        }
      }
    } catch (error) {
      console.error('更新用户信息失败:', error);
    }
  }

  // 创建公司
  async createCompany(name: string, description?: string): Promise<{ success: boolean; message: string; company?: Company }> {
    try {
      if (!this.currentUser) {
        return { success: false, message: '请先登录' };
      }

      if (!name.trim()) {
        return { success: false, message: '请输入公司名称' };
      }

      // 检查用户是否已有公司
      if (this.currentUser.companyId) {
        return { success: false, message: '您已经加入了公司，无法创建新公司' };
      }

      // 检查公司名称是否已存在
      const companies = this.getAllCompanies();
      const existingCompany = companies.find(c => c.name === name.trim());
      if (existingCompany) {
        return { success: false, message: '公司名称已存在' };
      }

      // 创建新公司
      const newCompany: Company = {
        id: this.generateId(),
        name: name.trim(),
        adminPhone: this.currentUser.phone,
        adminId: this.currentUser.id,
        description: description?.trim(),
        createTime: Date.now(),
        memberCount: 1,
        status: 'active'
      };

      // 保存公司信息
      companies.push(newCompany);
      wx.setStorageSync(this.storageKeys.companyList, JSON.stringify(companies));

      // 更新用户信息
      this.currentUser.companyId = newCompany.id;
      this.currentUser.companyName = newCompany.name;
      this.currentUser.role = 'admin';
      this.updateUser(this.currentUser);

      return { success: true, message: '公司创建成功', company: newCompany };
    } catch (error) {
      console.error('创建公司失败:', error);
      return { success: false, message: '创建公司失败，请重试' };
    }
  }

  // 申请加入公司
  async applyToCompany(companyId: string): Promise<{ success: boolean; message: string }> {
    try {
      if (!this.currentUser) {
        return { success: false, message: '请先登录' };
      }

      if (this.currentUser.companyId) {
        return { success: false, message: '您已经加入了公司' };
      }

      // 查找公司
      const companies = this.getAllCompanies();
      const company = companies.find(c => c.id === companyId);
      if (!company) {
        return { success: false, message: '公司不存在' };
      }

      // 检查是否已有待处理的申请
      const applications = this.getAllApplications();
      const existingApplication = applications.find(
        app => app.userId === this.currentUser!.id && app.companyId === companyId && app.status === 'pending'
      );
      if (existingApplication) {
        return { success: false, message: '您已经提交过申请，请等待审核' };
      }

      // 创建申请记录
      const newApplication: CompanyApplication = {
        id: this.generateId(),
        userId: this.currentUser.id,
        userPhone: this.currentUser.phone,
        userNickname: this.currentUser.nickname,
        companyId: company.id,
        companyName: company.name,
        status: 'pending',
        applyTime: Date.now()
      };

      applications.push(newApplication);
      wx.setStorageSync(this.storageKeys.applicationList, JSON.stringify(applications));

      return { success: true, message: '申请已提交，请等待管理员审核' };
    } catch (error) {
      console.error('申请加入公司失败:', error);
      return { success: false, message: '申请失败，请重试' };
    }
  }

  // 处理公司申请（管理员功能）
  async processApplication(applicationId: string, action: 'approve' | 'reject'): Promise<{ success: boolean; message: string }> {
    try {
      if (!this.currentUser || this.currentUser.role !== 'admin') {
        return { success: false, message: '只有管理员可以处理申请' };
      }

      const applications = this.getAllApplications();
      const application = applications.find(app => app.id === applicationId);
      if (!application) {
        return { success: false, message: '申请不存在' };
      }

      if (application.status !== 'pending') {
        return { success: false, message: '该申请已被处理' };
      }

      // 更新申请状态
      application.status = action === 'approve' ? 'approved' : 'rejected';
      application.processTime = Date.now();
      application.processBy = this.currentUser.id;

      if (action === 'approve') {
        // 更新用户信息
        const users = this.getAllUsers();
        const user = users.find(u => u.id === application.userId);
        if (user) {
          user.companyId = application.companyId;
          user.companyName = application.companyName;
          user.role = 'member';
          this.updateUser(user);
        }

        // 更新公司成员数量
        const companies = this.getAllCompanies();
        const company = companies.find(c => c.id === application.companyId);
        if (company) {
          company.memberCount += 1;
          wx.setStorageSync(this.storageKeys.companyList, JSON.stringify(companies));
        }
      }

      wx.setStorageSync(this.storageKeys.applicationList, JSON.stringify(applications));

      return { 
        success: true, 
        message: action === 'approve' ? '申请已通过' : '申请已拒绝' 
      };
    } catch (error) {
      console.error('处理申请失败:', error);
      return { success: false, message: '处理申请失败，请重试' };
    }
  }

  // 获取所有公司
  getAllCompanies(): Company[] {
    try {
      const companiesData = wx.getStorageSync(this.storageKeys.companyList);
      return companiesData ? JSON.parse(companiesData) : [];
    } catch (error) {
      console.error('获取公司列表失败:', error);
      return [];
    }
  }

  // 获取所有申请
  getAllApplications(): CompanyApplication[] {
    try {
      const applicationsData = wx.getStorageSync(this.storageKeys.applicationList);
      return applicationsData ? JSON.parse(applicationsData) : [];
    } catch (error) {
      console.error('获取申请列表失败:', error);
      return [];
    }
  }

  // 获取当前用户的公司信息
  getCurrentCompany(): Company | null {
    if (!this.currentUser || !this.currentUser.companyId) {
      return null;
    }
    
    const companies = this.getAllCompanies();
    return companies.find(c => c.id === this.currentUser!.companyId) || null;
  }

  // 获取待处理的申请（管理员功能）
  getPendingApplications(): CompanyApplication[] {
    if (!this.currentUser || this.currentUser.role !== 'admin' || !this.currentUser.companyId) {
      return [];
    }

    const applications = this.getAllApplications();
    return applications.filter(
      app => app.companyId === this.currentUser!.companyId && app.status === 'pending'
    );
  }

  // 更换公司管理员
  async changeAdmin(newAdminPhone: string): Promise<{ success: boolean; message: string }> {
    try {
      if (!this.currentUser || this.currentUser.role !== 'admin') {
        return { success: false, message: '只有管理员可以更换管理员' };
      }

      if (!this.validatePhone(newAdminPhone)) {
        return { success: false, message: '请输入正确的手机号码' };
      }

      const company = this.getCurrentCompany();
      if (!company) {
        return { success: false, message: '公司信息不存在' };
      }

      // 查找新管理员用户
      const users = this.getAllUsers();
      const newAdmin = users.find(u => u.phone === newAdminPhone && u.companyId === company.id);
      if (!newAdmin) {
        return { success: false, message: '该用户不存在或不在当前公司' };
      }

      if (newAdmin.id === this.currentUser.id) {
        return { success: false, message: '不能将自己设为管理员' };
      }

      // 更新公司信息
      company.adminPhone = newAdminPhone;
      company.adminId = newAdmin.id;
      const companies = this.getAllCompanies();
      const companyIndex = companies.findIndex(c => c.id === company.id);
      if (companyIndex !== -1) {
        companies[companyIndex] = company;
        wx.setStorageSync(this.storageKeys.companyList, JSON.stringify(companies));
      }

      // 更新用户角色
      newAdmin.role = 'admin';
      this.currentUser.role = 'member';
      this.updateUser(newAdmin);
      this.updateUser(this.currentUser);

      return { success: true, message: '管理员更换成功' };
    } catch (error) {
      console.error('更换管理员失败:', error);
      return { success: false, message: '更换管理员失败，请重试' };
    }
  }
}

// 导出单例实例
export const userManager = UserManager.getInstance(); 
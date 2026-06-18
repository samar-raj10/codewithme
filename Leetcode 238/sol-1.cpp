/*
1.The first thought which came in my mind is to think about the carry forward technique in precomputation method.

2. So i made two different arrays left and right.
left[i]-> will store the multplication of all elements till left of i;
right[i]->will store the multplication of all elements to the right of i;

3. At last we will just multiply left[i] with right[i] and store it in another ans array.

4. Very simple if you just look upon the pattern.


*/

#include <iostream>

using namespace std;

int main()
{
    const int n = 4;
    int arr[n] = {1, 2, 3, 4};
    int left[n], right[n], res[n];

    left[0] = 1;
    for (int i = 1; i < n; i++)
    {
        left[i] = left[i - 1] * arr[i - 1];
    }

    right[n - 1] = 1;
    for (int i = n - 2; i >= 0; i--)
    {
        right[i] = right[i + 1] * arr[i + 1];
    }

    for (int i = 0; i < n; i++)
    {
        res[i] = left[i] * right[i];
    }

    for (int i = 0; i < n; i++)
    {
        cout << res[i] << " ";
    }

    return 0;
}

/*
T.C. :  O(N)
S.C. :  O(N)  -> can be optimized
*/
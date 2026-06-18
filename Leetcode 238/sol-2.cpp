/*
How to optimize space complexity in pre-computation type problems.
1. Instead of making two different arrays for left and right, why not we should perform the same on the result array only.

*/

#include <iostream>

using namespace std;

int main()
{
    const int n = 4;
    int arr[n] = {1, 2, 3, 4};
    int res[n];
    int left = 1, right = 1;

    for (int i = 0; i < n; i++)
    {
        if (i > 0)
        {
            left = left * arr[i - 1];
        }
        res[i] = left;
    }
    for (int i = n - 1; i >= 0; i--)
    {
        if (i < n - 1)
        {
            right = right * arr[i + 1];
        }
        res[i] = res[i] * right;
    }

    // TC : O(N)
    // SC : O(1)
}